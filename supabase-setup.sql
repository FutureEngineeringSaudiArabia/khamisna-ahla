-- إعداد قاعدة بيانات موقع «خميسنا أحلى» على Supabase
-- يُشغَّل مرة واحدة في SQL Editor

create extension if not exists pgcrypto;

-- ١. إعدادات الموقع العامة (الفعاليات والنتائج المجمّعة) — يقرؤها الجميع ولا يكتبها إلا الفريق
create table if not exists public_state (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
insert into public_state (id, data) values (1, '{}'::jsonb) on conflict do nothing;

-- ٢. الردود — يرسلها الجميع ولا يقرؤها إلا الفريق
create table if not exists responses (
  id bigserial primary key,
  kind text not null check (kind in ('pre','post','role','idea','teacher','parent')),
  event_id text not null check (length(event_id) < 80),
  payload jsonb not null check (pg_column_size(payload) < 8000),
  ts timestamptz default now()
);

-- ٣. الأسرار (الرقم السري ورمزا الدخول) — لا يصل إليها أحد إلا عبر الدوال
create table if not exists secrets (
  k text primary key,
  h text not null
);

alter table public_state enable row level security;
alter table responses enable row level security;
alter table secrets enable row level security;

grant usage on schema public to anon;
grant select on public_state to anon;
grant insert on responses to anon;
grant usage on sequence responses_id_seq to anon;
revoke all on secrets from anon, authenticated;

drop policy if exists "read public state" on public_state;
create policy "read public state" on public_state for select to anon using (true);
drop policy if exists "send responses" on responses;
create policy "send responses" on responses for insert to anon with check (true);
-- لا توجد سياسة قراءة للردود ولا أي سياسة على secrets: الوصول عبر الدوال فقط

-- التحقق من الرقم السري
create or replace function _ok(p_pin text) returns boolean
language sql security definer set search_path = public, extensions as $$
  select exists(select 1 from secrets where k = 'admin' and h = crypt(p_pin, h));
$$;

create or replace function admin_login(p_pin text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform pg_sleep(0.5); -- يبطّئ محاولات التخمين
  return _ok(p_pin);
end $$;

create or replace function admin_save_state(p_pin text, p_data jsonb) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not _ok(p_pin) then raise exception 'unauthorized'; end if;
  update public_state set data = p_data, updated_at = now() where id = 1;
end $$;

create or replace function admin_responses(p_pin text) returns setof json
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not _ok(p_pin) then raise exception 'unauthorized'; end if;
  return query select json_build_object('kind',kind,'event_id',event_id,'payload',payload,'ts',ts) from responses order by id;
end $$;

create or replace function admin_change_pin(p_pin text, p_new text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not _ok(p_pin) then raise exception 'unauthorized'; end if;
  update secrets set h = crypt(p_new, gen_salt('bf')) where k = 'admin';
end $$;

-- التحقق من رمز دخول المعلمات (t) وأولياء الأمور (p)
create or replace function check_access(p_group text, p_code text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform pg_sleep(0.3);
  return exists(select 1 from secrets where k = 'access_' || p_group and h = crypt(p_code, h));
end $$;

create or replace function admin_set_access(p_pin text, p_group text, p_code text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not _ok(p_pin) then raise exception 'unauthorized'; end if;
  if p_group not in ('t','p') then raise exception 'bad group'; end if;
  insert into secrets(k,h) values ('access_'||p_group, crypt(p_code, gen_salt('bf')))
  on conflict (k) do update set h = excluded.h;
end $$;

revoke all on function _ok(text) from public, anon;
grant execute on function admin_login(text), admin_save_state(text,jsonb), admin_responses(text),
  admin_change_pin(text,text), check_access(text,text), admin_set_access(text,text,text) to anon;

-- القيم الأولى (تُغيَّر بعد ذلك من لوحة الفريق)
insert into secrets(k,h) values
  ('admin',    crypt('1448', gen_salt('bf'))),
  ('access_t', crypt('1447', gen_salt('bf'))),
  ('access_p', crypt('1415', gen_salt('bf')))
on conflict (k) do nothing;
