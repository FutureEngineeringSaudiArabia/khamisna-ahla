(function(){
"use strict";
const $ = s => document.querySelector(s);
const app = $("#app");
let S = null;            // الحالة العامة
let RESP = null;         // الردود (للفريق فقط)
const VALUE_IND = new Set(["احترام الثقافات","الاحترام","الروح الرياضية"]);
const AR = n => String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]).replace(/\./g,"٫");
const esc = t => String(t==null?"":t).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const track = id => TRACKS.find(t=>t.id===id) || TRACKS[0];
const evById = id => S.events.find(e=>e.id===id);
const pct = (a,b) => b ? Math.round(a*1000/b)/10 : null;
const fmtP = v => v==null ? null : AR(v.toFixed ? (Math.round(v*10)/10) : v)+"٪";


const IC = {
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>',
 moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>', contrast:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18Z" fill="currentColor"/>',
 zin:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>', zout:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M8 11h6"/>',
 spark:'<path d="M9.9 4.2 11 7.6a2 2 0 0 0 1.3 1.3l3.4 1.1-3.4 1.1a2 2 0 0 0-1.3 1.3L9.9 15.8 8.8 12.4a2 2 0 0 0-1.3-1.3L4.1 10l3.4-1.1A2 2 0 0 0 8.8 7.6Z"/><path d="M18 3v4M16 5h4M18 15v4M16 17h4"/>',
 book:'<path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z"/>',
 backpack:'<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5M8 10h8"/>',
 teacher:'<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
 home:'<path d="M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/>',
 lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 trophy:'<path d="M6 9H4a2 2 0 0 1 0-4h2M18 9h2a2 2 0 0 0 0-4h-2M4 22h16M10 15v3a2 2 0 0 1-2 2h8a2 2 0 0 1-2-2v-3M18 2H6v7a6 6 0 0 0 12 0Z"/>',
 chart:'<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>', camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"/><circle cx="12" cy="13" r="3"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>', calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 hand:'<path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.4L3.4 16a2 2 0 0 1 3-2.6L8 15"/>',
 msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>', clip:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h4"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>', target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 heart:'<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
 arrow:'<path d="M19 12H5M12 19l-7-7 7-7"/>', help:'<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'
};
const icon = (n,cls="") => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||""}</svg>`;
const banner = (t, sub) => `<div class="pbanner"><h1 class="ptitle">${t}</h1>${sub?`<p>${sub}</p>`:""}</div>`;
const secT = t => `<h2 class="sec">${t}</h2>`;
/* ---------- اختيار الفعالية الحالية ---------- */
function currentEventId(){
  const saved = KV.get("kh2_ev");
  if(saved && evById(saved)) return saved;
  const today = new Date().toISOString().slice(0,10);
  const upcoming = S.events.filter(e=>e.status!=="مسودة" && e.iso>=today).sort((a,b)=>a.iso<b.iso?-1:1)[0];
  return (upcoming || S.events.filter(e=>e.status!=="مسودة").slice(-1)[0] || S.events[0]).id;
}
function setEvent(id){ KV.set("kh2_ev", id); }

/* ---------- عناصر مشتركة ---------- */
function toast(msg, ok=true){
  const t = document.createElement("div"); t.className="toast "+(ok?"ok":"bad"); t.textContent=msg;
  document.body.appendChild(t); setTimeout(()=>t.classList.add("show"),10);
  setTimeout(()=>{t.classList.remove("show"); setTimeout(()=>t.remove(),400)},3200);
}
function back(href, label){ return `<a class="back" href="${href}"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg> ${label}</a>`; }
function statusChip(st){ const c={"منفّذة":"c-done","مجدولة":"c-sched","مسودة":"c-draft"}[st]||"c-draft"; return `<span class="chip ${c}">${st} ✦</span>`; }
function saveBadge(){
  return STORE.shared
    ? `<div class="savebar on">🟢 الحفظ المشترك مفعّل — تصل إجابتك إلى فريق المبادرة.</div>`
    : `<div class="savebar">🟡 وضع المعاينة: تُحفظ الإجابة على هذا الجهاز فقط إلى أن يُفعَّل الحفظ المشترك.</div>`;
}
function eventPicker(base){
  const list = S.events.filter(e=>e.status!=="مسودة");
  const cur = currentEventId();
  return `<div class="evpick" role="tablist">${list.map(e=>{const t=track(e.track);return `<button class="evbtn ${e.id===cur?"on":""}" data-act="pick-ev" data-id="${e.id}" data-base="${base}" style="--c:${t.c}"><span>${t.ic}</span><b>${esc(t.name)}</b><small>${esc(e.date)}</small></button>`}).join("")}</div>`;
}
function stepMap(steps, active){
  return `<nav class="ministeps">${steps.map((s,i)=>`<a class="ms ${i===active?"on":""} ${i<active?"past":""}" href="${s.href}"><span>${s.ic}</span>${s.t}</a>`).join("")}</nav>`;
}
function todoBox(title, steps, c){
  return `<div class="todo2"><h2>${title}</h2>${steps.map((s,i)=>`
    <a class="tdo" href="${s.href}"><span class="tn">${AR(i+1)}</span><span class="ti">${icon(s.ico||"spark")}</span><span class="tt"><b>${s.t}</b><small>${s.todo}</small></span><span class="tgo">${s.btn} ←</span></a>`).join("")}</div>`;
}
function linkBtn(url, label, cls="btn ghost"){
  return url ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${label} ↗</a>`
             : `<span class="btn disabled" title="يضيفه فريق المبادرة من لوحة التحكم">${label} · الرابط بانتظار الإضافة</span>`;
}
function facesInput(name){
  return `<div class="faces" role="radiogroup">${FACES.map(f=>`<label class="face"><input type="radio" name="${name}" value="${f.v}" required><span class="fe">${f.e}</span><small>${f.t}</small></label>`).join("")}</div>`;
}
function savedCode(){ try{ return KV.get("kh2_code")||""; }catch(e){ return ""; } }
function codePicker(){
  const c = savedCode();
  if(c) return `<div class="mycode"><span>${icon("users")} رمزكِ: <b>${esc(c)}</b></span><button type="button" class="btn ghost sm" data-act="code-change">ليس رمزي؟ تغيير</button><input type="hidden" name="savedcode" value="${esc(c)}"></div>`;
  const stages = Object.keys(CONFIG.classes);
  return `<fieldset class="codebox"><legend>رمزكِ في المبادرة <small>· مرة واحدة فقط</small></legend>
    <div class="row2 keep">
      <label>المرحلة<select name="stage" data-act="stage-change" required><option value="">اختاري</option>${stages.map(s=>`<option>${s}</option>`).join("")}</select></label>
      <label>الفصل<select name="cls" required><option value="">—</option></select></label>
      <label>رقمك في الكشف<select name="num" required><option value="">—</option>${Array.from({length:40},(_,i)=>`<option value="${String(i+1).padStart(2,"0")}">${AR(i+1)}</option>`).join("")}</select></label>
      <label>أول حرفين من اسمك<input name="letters" maxlength="2" minlength="2" pattern="[ء-ي]{2}" placeholder="فا" required></label>
    </div>
    <div class="codeprev">رمزك: <b data-codeprev>—</b> · يُحفظ على جهازك فلا تكتبينه مرة أخرى.</div>
  </fieldset>`;
}
function readCode(form){
  const f = new FormData(form);
  if(f.get("savedcode")) return f.get("savedcode");
  const cls=f.get("cls"), num=f.get("num"), l=(f.get("letters")||"").trim();
  if(!cls||!num||l.length!==2) return null;
  return `${cls}-${AR(num)}-${l}`;
}
function rememberCode(c){ try{ KV.set("kh2_code", c); }catch(e){} }

/* ================= الصفحة الرئيسية ================= */
function vHome(){
  const ch = S.events.find(e=>e.status==="مجدولة");
  const done = S.events.filter(e=>e.status==="منفّذة").length;
  return `
  <section class="hero">
    <div class="grid-bg"></div><div class="glow"></div>
    <div class="hero-in">
      <div class="seal big"><span>خميسنا</span><b>أحلى</b><small>١٤٤٨هـ</small></div>
      <div class="kicker">${icon("spark")} ${esc(CONFIG.school)}</div>
      <h1 class="logo">خميسنا أحلى</h1>
      <div class="tagline">نتعلّم · نشارك · نُبدع</div>
      <p class="lead">كل خميس فعالية تجمع التعلّم والمتعة والمشاركة. الطالبات يقترحن ويخطّطن وينظّمن ويقدّمن، والمعلمات يشرفن ويرصدن المهارات، والأسرة تدعم وتُثري.</p>
      ${ch?`<div class="count" data-iso="${ch.iso}">
        <div class="ctitle">${esc(ch.title)}</div><small class="cdate">${esc(ch.date)}</small>
        <div class="cdown"><div><b data-d>–</b><small>يوم</small></div><div><b data-h>–</b><small>ساعة</small></div><div><b data-m>–</b><small>دقيقة</small></div></div>
        <a class="btn hot" href="#/s">شاهدي فعالية هذا الأسبوع ${icon("arrow")}</a>
      </div>`:""}
    </div>
  </section>

  <section class="wrap">
    <div class="stats">
      <div><b>${AR(TRACKS.length)}</b><small>مسارات خميس</small></div>
      <div><b>${AR(done)}</b><small>فعالية منفّذة</small></div>
      <div><b>${AR(INDICATORS.length)}</b><small>مؤشر أثر</small></div>
    </div>
    ${secT("مرحبًا بكنّ في خميسنا أحلى")}
    <p class="intro">«خميسنا أحلى» مبادرة مدرسية ممتدة في ${esc(CONFIG.school)} خلال ${esc(CONFIG.term)}، تجعل يوم الخميس مساحة للتعلّم والمتعة، وتمنح طالبات المرحلتين المتوسطة والثانوية دورًا حقيقيًا في <b>اقتراح الفعاليات واختيارها والتخطيط لها وتنظيمها وتقديمها وتوثيقها</b>.</p>
    <div class="vm">
      <div class="vmc"><h3>الرؤية</h3><p>خميسٌ تنتظره كل طالبة؛ تتعلّم فيه وتقود وتُبدع، وتكتشف موهبتها في مدرسة جاذبة.</p></div>
      <div class="vmc c2"><h3>الرسالة</h3><p>فعاليات أسبوعية متنوعة تصنعها الطالبات بإشراف المعلمات وشراكة الأسرة، تنمّي المهارات والقيم والمواهب والقيادة، ونقيس أثرها لنطوّرها باستمرار.</p></div>
    </div>
    ${secT("أهدافنا")}
    <div class="goals">
      ${[["home","خميس جاذب","يوم ننتظره يقوّي الانتماء ويدعم الحضور"],["users","مشاركة أوسع","فرصة لكل طالبة لتشارك بدورها"],["trophy","قيادة ومسؤولية","تعاون وتواصل وتحمّل للمسؤولية"],["spark","مواهب تظهر","مساحة للإلقاء والرسم والتصميم وغيرها"],["heart","شراكة مع الأسرة","الأسرة تدعم بناتها وتُثري الفعاليات"]].map(g=>`<div class="goal">${icon(g[0],"gi")}<b>${g[1]}</b><small>${g[2]}</small></div>`).join("")}
    </div>
    ${secT("خميسات المبادرة")}
    <div class="tracks">
      ${TRACKS.map(t=>{const evs=S.events.filter(e=>e.track===t.id&&e.status!=="مسودة");
        return `<div class="track ${evs.length?"has":"idea"}">
          ${evs.length?`<span class="badge">${evs[0].status} ✦</span>`:`<span class="badge soft">مسار مقترح</span>`}
          <div class="tic">${t.ic}</div><b>${t.name}</b><small>${t.d}</small>
          ${evs.map(e=>`<div class="tev">${icon("calendar")} ${esc(e.date)}</div>`).join("")}
        </div>`}).join("")}
    </div>
    ${secT("ادخلي إلى موقع المبادرة حسب الفئة")}
    <div class="portals">
      <a class="portal p1" href="#/s">${icon("backpack","pic")}<b>الطالبات</b><small>تعرّفي على فعالية الخميس، وكيف تشاركين فيها، وأين تسجّلين رأيك بعدها.</small><span class="go">ادخلي ${icon("arrow")}</span></a>
      <a class="portal p2" href="#/t">${icon("teacher","pic")}<b>المعلمات</b><small>اطلعي على دليل التنفيذ، وسجّلي ملاحظاتك عن المشاركة والمهارات التي ظهرت.</small><span class="go">ادخلي ${icon("arrow")}</span></a>
      <a class="portal p3" href="#/p">${icon("home","pic")}<b>أولياء الأمور</b><small>تعرّفوا على الفعاليات، وكيف تدعمون مشاركة بناتكم، وشاركونا ما لاحظتموه بعدها.</small><span class="go">ادخلوا ${icon("arrow")}</span></a>
      <a class="portal p4" href="#/team">${icon("lock","pic")}<b>فريق المبادرة · لوحة التحكم</b><small>دخول برقم سري لإدارة الفعاليات ومراجعة نتائج التقويم والشواهد وتصديرها.</small><span class="go">دخول ${icon("arrow")}</span></a>
    </div>
    <div class="quick">
      <a class="qcard" href="#/board">${icon("trophy","gi")}<b>النقاط والشارات</b><small>ترتيب الفصول وشاراتك.</small><span class="lnk">افتحي ${icon("arrow")}</span></a>
      <a class="qcard" href="#/impact">${icon("chart","gi")}<b>بصمة الأثر</b><small>نتائج المؤشرات المجمّعة.</small><span class="lnk">افتحي ${icon("arrow")}</span></a>
      <a class="qcard" href="#/evidence">${icon("camera","gi")}<b>معرض الشواهد</b><small>صور كل خميس.</small><span class="lnk">افتحي ${icon("arrow")}</span></a>
      <a class="qcard" href="#/about">${icon("info","gi")}<b>عن المبادرة</b><small>الأدوات والقياس والخصوصية.</small><span class="lnk">افتحي ${icon("arrow")}</span></a>
    </div>
  </section>`;
}
/* ================= الطالبات ================= */
const S_STEPS = [
  {href:"#/s/week", ico:"calendar", ic:"📅", t:"خميس هذا الأسبوع", todo:"اطّلعي على الموعد وفكرة الفعالية ودورك.", btn:"شاهدي الفعالية"},
  {href:"#/s/join", ico:"hand", ic:"🙋‍♀️", t:"كيف أشارك؟", todo:"أجيبي عن الاختبار القبلي قبل الفعالية، واختاري دورك أو قدّمي فكرة.", btn:"ابدئي المشاركة"},
  {href:"#/s/after", ico:"msg",ic:"💬", t:"رأيي بعد الفعالية", todo:"أجيبي عن الاختبار البعدي، واكتبي ما تعلّمتِه، وقيّمي رضاكِ 😍.", btn:"سجّلي رأيك"}
];
function doneKey(kind,eid){ return "kh2_done_"+kind+"_"+eid+"_"+savedCode(); }
function isDone(kind,eid){ return savedCode() ? KV.get(doneKey(kind,eid)) : null; }
function studentEvents(){ return S.events.filter(e=>e.status!=="مسودة").sort((a,b)=>a.iso<b.iso?-1:1); }
function codeGate(){
  return savedCode()
    ? `<div class="stepbox ok"><span class="sn">✓</span><div class="sb">${codePicker()}</div></div>`
    : `<form class="stepbox" data-form="setcode"><span class="sn">١</span><div class="sb"><h3>سجّلي بياناتك أولًا</h3><p class="small">مرة واحدة فقط، ثم تفتح لكِ كل الخميسات.</p>${codePicker()}<button class="btn hot">حفظ والمتابعة</button></div></form>`;
}
function vStudents(){
  const has = !!savedCode();
  const evs = studentEvents();
  return `<section class="wrap page">
    ${back("#/","الرئيسية")}
    ${banner("الطالبات","سجّلي بياناتك، ثم ادخلي الخميس الذي تشاركين فيه.")}
    ${codeGate()}
    <div class="stepbox ${has?"":"dim"}"><span class="sn">${has?"٢":"٢"}</span><div class="sb"><h3>المطلوب منكِ في كل خميس</h3>
      <ol class="req"><li><b>قبل الفعالية:</b> الاختبار القبلي.</li><li><b>سجّلي دورك</b> في الفعالية.</li><li><b>بعد الفعالية:</b> الاختبار البعدي، وماذا تعلّمتِ، وقياس الرضا.</li></ol></div></div>
    <h2 class="sec">خميسات المبادرة</h2>
    ${has?"":`<p class="pending big">⬆️ سجّلي بياناتك أولًا لتفتح الخميسات.</p>`}
    <div class="evlist">${evs.map(e=>{const t=track(e.track); const n=["pre","role","post"].filter(k=>isDone(k,e.id)).length;
      return `<a class="evrow ${has?"":"locked"}" href="${has?"#/s/ev":"#/s"}" data-act="${has?"pick-ev-go":""}" data-id="${e.id}">
        <span class="evi">${t.ic}</span>
        <span class="evt"><b>${esc(e.title)}</b><small>${icon("calendar")} ${esc(e.date)} · ${esc(e.stage)}</small>
        <span class="prog3">${[0,1,2].map(i=>`<i class="${i<n?"on":""}"></i>`).join("")}<em>${AR(n)} من ٣</em></span></span>
        ${statusChip(e.status)}
        <span class="go">${has?`ادخلي ${icon("arrow")}`:"🔒"}</span></a>`}).join("")}</div>
    ${myBoard()}
  </section>`;
}
function myBoard(){
  const c=savedCode(); if(!c) return "";
  const evs=studentEvents();
  const doneEv=evs.filter(e=>["pre","role","post"].every(k=>isDone(k,e.id))).length;
  const steps=evs.reduce((a,e)=>a+["pre","role","post"].filter(k=>isDone(k,e.id)).length,0);
  const my=S.badges[c]||[];
  const cls=c.split("-")[0];
  const ranks=Object.entries(S.board).sort((a,b)=>b[1]-a[1]); const ri=ranks.findIndex(x=>x[0]===cls);
  const H=S.highlights||{};
  const lead=ranks[0];
  return `<h2 class="sec">إنجازاتي وشاراتي ونقاط فصلي</h2>
  <div class="mytiles">
    <div class="mt">${icon("calendar","gi")}<b>${AR(steps)}</b><small>خطوة أنجزتِها${doneEv?` · ${AR(doneEv)} خميس مكتمل`:""}</small></div>
    <div class="mt">${icon("spark","gi")}<b>${AR(my.length)}</b><small>${my.length?my.map(k=>(BADGES.find(b=>b.k===k)||{}).e+" "+k).join(" · "):"شارة — شاركي لتحصلي على أولاها"}</small></div>
    <div class="mt">${icon("trophy","gi")}<b>${ri>=0?AR(ri+1):"—"}</b><small>ترتيب فصل ${esc(cls)}${ri>=0?` · ${AR(ranks[ri][1])} نقطة`:" · لا نقاط بعد"}</small></div>
  </div>
  <div class="hilites">
    <div class="hl1">${icon("trophy")}<span><small>الفصل المتصدّر</small><b>${lead?esc(lead[0])+" · "+AR(lead[1])+" نقطة":"⏳ يُعلن بعد أول رصد"}</b></span></div>
    <div class="hl2">💡<span><small>فكرة الشهر</small><b>${H.idea?esc(H.idea):"⏳ تُعلن قريبًا — قدّمي فكرتك من داخل أي خميس"}</b></span></div>
    <div class="hl3">🌟<span><small>موهبة الخميس</small><b>${H.talent?esc(H.talent):"⏳ تُعلن بعد الفعالية"}</b></span></div>
  </div>
  <h2 class="sec">كيف تتميّزين؟</h2>
  <div class="mechs">
    <div class="mc"><span>👑</span><b>قائدة الخميس</b><small>تقود فريق فعالية: توزّع المهام وتتابع التنفيذ.</small><em>+٣ لفصلك · شارة قائدة</em></div>
    <div class="mc"><span>👭</span><b>فريق الخميس</b><small>تخطّط وتنظّم الفعالية مع المعلمة المشرفة.</small><em>+٣ لفصلك</em></div>
    <div class="mc"><span>🌟</span><b>موهبة الخميس</b><small>تقدّم موهبتها: إلقاء، رسم، تصميم، طبخ…</small><em>+٣ لفصلك · شارة موهوبة</em></div>
    <div class="mc"><span>💡</span><b>فكرة الشهر</b><small>أفضل اقتراح يتحوّل إلى خميس تنفّذه صاحبته.</small><em>+٥ إذا نُفّذت · شارة صاحبة فكرة</em></div>
    <div class="mc"><span>🙋‍♀️</span><b>كل مشاركة</b><small>أي دور في الفعالية يرفع رصيد فصلك.</small><em>+١ لفصلك</em></div>
  </div>
  <div class="acts"><a class="btn ghost" href="#/board">ترتيب كل الفصول وشاراتي</a></div>`;
}
function testForm(kind, e){
  const Q=QUESTIONS[e.id]; const qs=Q[kind]; const isPost=kind==="post";
  return `<form data-form="${kind}" class="test inline">
      <input type="hidden" name="savedcode" value="${esc(savedCode())}">
      <div class="prog"><div class="bar" data-bar></div></div>
      ${qs.map((q,i)=>`<div class="q" data-q="${i}">
        <div class="qn">سؤال ${AR(i+1)} من ٥</div>
        <p class="qt">${esc(q.q)}</p>
        <div class="opts">${q.o.map((o,j)=>`<label class="opt"><input type="radio" name="q${i}" value="${j}" required><span>${esc(o)}</span></label>`).join("")}</div>
      </div>`).join("")}
      ${isPost?`
      <h3 class="part">✍️ ماذا تعلّمتِ؟</h3>
      <div class="q write"><p class="qt">قبل هذا الخميس كنتُ أظن… والآن…</p><div class="ex">مثال: ${esc(Q.deepEx)}</div>
        <textarea name="deep" rows="3" maxlength="400" required placeholder="كنتُ أظن … والآن …"></textarea></div>
      <div class="q write"><p class="qt">اكتبي معلومة جديدة أو مهارة واحدة تعلّمتِها.</p><div class="ex">مثال: ${esc(Q.specEx)}</div>
        <textarea name="spec" rows="2" maxlength="300" required></textarea></div>
      <div class="q write"><p class="qt">ما الذي تقترحينه لتحسين الخميس القادم؟ <small>(اختياري)</small></p>
        <textarea name="improve" rows="2" maxlength="300"></textarea></div>
      <div class="satbox"><h3>😍 قياس الرضا</h3><p class="qt">ما مدى رضاكِ عن هذه الفعالية؟</p>${facesInput("sat")}</div>`:""}
      <button class="btn hot big">إرسال</button>
    </form>`;
}
function vSEvent(){
  if(!savedCode()){ location.hash="#/s"; return ""; }
  const e=evById(currentEventId()), t=track(e.track), L=S.links[e.id]||{}, Q=QUESTIONS[e.id];
  const roles = ["قائدة الخميس","عضوة في فريق الخميس","مقدّمة أو مُلقية","مصممة أو راسمة","منظّمة أركان أو مسابقة","موثّقة بالصور","مشاركة أو زائرة"];
  const pre=isDone("pre",e.id), role=isDone("role",e.id), post=isDone("post",e.id);
  const step=(n,title,done,body,doneMsg)=>`<div class="stepbox ${done?"ok":""}"><span class="sn">${done?"✓":AR(n)}</span><div class="sb"><h3>${title}</h3>${done?`<p class="donemsg">${doneMsg}</p>`:body}</div></div>`;
  return `<section class="wrap page">
    ${back("#/s","كل الخميسات")}
    <article class="evcard">
      <div class="evhead"><span class="evic">${t.ic}</span><div><h2>${esc(e.title)}</h2><div class="meta">${statusChip(e.status)} ${esc(e.date)} · ${esc(e.stage)}</div></div></div>
      <h4>🎯 الهدف</h4><p>${esc(e.goal)}</p>
      <h4>🙋‍♀️ دوركِ</h4><p>${esc(e.tasks.students)}</p>
      ${L.padlet?`<div class="acts">${linkBtn(L.padlet,"إعلان الفعالية وصورها على Padlet")}</div>`:""}
    </article>
    <div class="mycodeline">${codePicker()}</div>
    ${step(1,"الاختبار القبلي <small>· ٥ أسئلة قبل الفعالية</small>", pre, Q?testForm("pre",e):`<p class="pending">⏳ الأسئلة لم تُضف بعد</p>`, "✅ أرسلتِ الاختبار القبلي. أحسنتِ!")}
    ${step(2,"سجّلي دورك", role, `<form data-form="role"><input type="hidden" name="savedcode" value="${esc(savedCode())}"><div class="chips">${roles.map(r=>`<label class="pill"><input type="radio" name="role" value="${r}" required><span>${r}</span></label>`).join("")}</div><button class="btn">سجّلي دورك</button></form>`, `✅ سجّلتِ دورك: <b>${esc(role||"")}</b>`)}
    ${step(3,"الاختبار البعدي وماذا تعلّمتِ وقياس الرضا", post, e.status!=="منفّذة"?`<p class="pending">🔒 يُفتح بعد تنفيذ الفعالية</p>`:(Q?testForm("post",e):""), `✅ أرسلتِ البعدي ورأيك. نتيجتك: <b>${esc(post||"")}</b>`)}
    <div class="stepbox opt"><span class="sn">💡</span><div class="sb"><h3>قدّمي فكرة لخميس قادم <small>(اختياري)</small></h3>
      <form data-form="idea"><input type="hidden" name="savedcode" value="${esc(savedCode())}"><textarea name="idea" rows="2" maxlength="300" required placeholder="مثال: خميس ألعاب ذهنية بين الفصول"></textarea><button class="btn ghost">أرسلي الفكرة</button></form>
      <p class="small">قد تُختار فكرتك «فكرة الشهر» وتنفّذينها مع فريقك.</p></div></div>
    <div class="acts"><a class="btn ghost" href="#/board">🏅 شاراتي ونقاط فصلي</a><a class="btn ghost" href="#/s">كل الخميسات</a></div>
    ${saveBadge()}
  </section>`;
}

/* ================= المعلمات ================= */
const T_STEPS = [
  {href:"#/t/guide", ico:"book",  ic:"📘", t:"دليل تنفيذ الفعالية", todo:"اطّلعي على الهدف ودورك.", btn:"افتحي الدليل"},
  {href:"#/t/card", ico:"clip",   ic:"📝", t:"بطاقة الملاحظة", todo:"سجّلي لكل فصل ما شاهدتِه من مشاركة ومهارات، وقيّمي رضاكِ، وأضيفي إجراء تحسين.", btn:"افتحي بطاقة الملاحظة"},
  {href:"#/t/results", ico:"chart",ic:"📊", t:"نتائج التقويم المجمّعة", todo:"شاهدي ما تحقق في الخميس.", btn:"شاهدي النتائج"}
];
function vTeachers(){
  const e = evById(currentEventId()), t=track(e.track);
  return `<section class="wrap page">
    ${back("#/","الرئيسية")}
    ${banner("المعلمات","دليل التنفيذ وبطاقة الملاحظة والنتائج.")}
    ${todoBox("المطلوب منكِ", T_STEPS, t.c)}
    <p class="small">اختاري الخميس:</p>
    ${eventPicker("#/t")}
  </section>`;
}
function vTGuide(){
  const e = evById(currentEventId()), t=track(e.track), Q=QUESTIONS[e.id]||{};
  return `<section class="wrap page">
    ${back("#/t","المعلمات")}
    ${stepMap(T_STEPS,0)}
    ${eventPicker("#/t/guide")}
    <article class="evcard" style="--c:${t.c}">
      <div class="evhead"><span class="evic">${t.ic}</span><div><h2>${esc(e.title)}</h2><div class="meta">${statusChip(e.status)} 📅 ${esc(e.date)} · 🎓 ${esc(e.stage)}</div></div></div>
      <h4>🎯 الهدف</h4><p>${esc(e.goal)}</p>
      <h4>👩‍🏫 دورك</h4><p>${esc(e.tasks.teachers)}</p>
      <h4>⏱️ قبل · أثناء · بعد</h4>
      <div class="phases">
        <div><b>قبل</b><small>ذكّري الطالبات بالاختبار القبلي وساعدي فصلك على توزيع الأدوار.</small></div>
        <div><b>أثناء</b><small>لاحظي المؤشرات الأربعة واكتبي مثالًا واحدًا لافتًا.</small></div>
        <div><b>بعد</b><small>عبّئي بطاقة الملاحظة لفصلك، وذكّري الطالبات بالبعدي.</small></div>
      </div>
      ${Q.teacherInd?`<h4>🔎 دليل المؤشرات (لتوحيد الحكم بين المعلمات)</h4>
      <table class="tbl"><tr><th>الحكم</th><th>متى أختاره؟</th></tr>
        <tr><td>ظهر بوضوح</td><td>أغلب طالبات الفصل أظهرن السلوك أكثر من مرة دون توجيه.</td></tr>
        <tr><td>ظهر جزئيًا</td><td>ظهر عند بعض الطالبات أو احتاج توجيهًا.</td></tr>
        <tr><td>لم يظهر</td><td>لم ألاحظه أو ظهر عكسه.</td></tr></table>
      <p class="small">مؤشرات هذا الخميس: ${Q.teacherInd.map(x=>`<span class="tag">${x}</span>`).join(" ")}</p>`:""}
      <div class="acts"><a class="btn hot" href="#/t/card">افتحي بطاقة الملاحظة</a></div>
    </article>
  </section>`;
}
function vTCard(){
  const e = evById(currentEventId()), t=track(e.track), Q=QUESTIONS[e.id]||{teacherInd:["المشاركة","التعاون","التواصل","الاحترام"]};
  const classes = [].concat(...Object.values(CONFIG.classes));
  const talentOpts = (e.talents&&e.talents.length?e.talents:["الإلقاء","الرسم","التصميم الرقمي","الطبخ","الرياضة"]).concat(["أخرى"]);
  const L=S.links[e.id]||{};
  return `<section class="wrap page">
    ${back("#/t","المعلمات")}
    ${stepMap(T_STEPS,1)}
    ${eventPicker("#/t/card")}
    <form class="box" data-form="teacher">
      <h3>📝 بطاقة الملاحظة · ${esc(t.name)}</h3>
      <p class="small">بطاقة واحدة لكل فصل.</p>
      <div class="row3">
        <label>الفصل<select name="cls" required><option value="">اختاري</option>${classes.map(c=>`<option>${c}</option>`).join("")}</select></label>
        <label>اسم المعلمة (اختياري)<input name="teacher" maxlength="40"></label>
      </div>
      <table class="obs"><tr><th>المؤشر</th><th>ظهر بوضوح</th><th>ظهر جزئيًا</th><th>لم يظهر</th></tr>
      ${Q.teacherInd.map((ind,i)=>`<tr><td>${ind} <small class="kind">${VALUE_IND.has(ind)?"قيمة":"مهارة"}</small></td>${["واضح","جزئي","لم"].map(v=>`<td><input type="radio" name="ind${i}" value="${v}" required aria-label="${ind} ${v}"></td>`).join("")}</tr>`).join("")}
      </table>
      <label>مثال محدد شاهدتِه (اختياري)<textarea name="example" rows="2" maxlength="300" placeholder="مثال: نسّقت طالبات الفصل الركن ووزّعن الشرح على الزائرات بالتناوب"></textarea></label>
      <div><b class="lbl">مواهب ظهرت في فصلك</b><div class="chips">${talentOpts.map(x=>`<label class="pill"><input type="checkbox" name="talents" value="${x}"><span>${x}</span></label>`).join("")}</div></div>
      <label>عدد الطالبات اللاتي أظهرن موهبة (تقريبي)<input type="number" name="talentCount" min="0" max="40" value="0"></label>
      <label>إجراء مقترح لتحسين الخميس القادم<textarea name="improve" rows="2" maxlength="300" required></textarea></label>
      <div class="satbox"><h3>😍 قياس الرضا</h3><p class="qt">ما مدى رضاكِ عن الفعالية؟</p>${facesInput("sat")}</div>
      <button class="btn hot big">إرسال البطاقة</button>
      ${saveBadge()}
    </form>
  </section>`;
}
function vTResults(){
  return `<section class="wrap page">
    ${back("#/t","المعلمات")}
    ${stepMap(T_STEPS,2)}
    ${eventPicker("#/t/results")}
    ${eventResultsBlock(currentEventId())}
  </section>`;
}

/* ================= أولياء الأمور ================= */
const P_STEPS = [
  {href:"#/p/about", ico:"info",  ic:"📣", t:"تعرّفوا على الفعالية", todo:"اطّلعوا على هدف الفعالية وموعدها.", btn:"تعرّفوا عليها"},
  {href:"#/p/support", ico:"heart",ic:"🤲", t:"كيف تدعمون ابنتكم؟", todo:"خطوات بسيطة تدعم مشاركتها من المنزل.", btn:"اطّلعوا"},
  {href:"#/p/form", ico:"msg",   ic:"💬", t:"رأيكم بعد الفعالية", todo:"شاركونا ما لاحظتموه، وقيّموا رضاكم 😍.", btn:"شاركونا"}
];
function vParents(){
  const e = evById(currentEventId()), t=track(e.track);
  return `<section class="wrap page">
    ${back("#/","الرئيسية")}
    ${banner("أولياء الأمور","شراكتكم تصنع الفرق في يوم بناتكم.")}
    ${todoBox("المطلوب منكم", P_STEPS, t.c)}
    <p class="small">اختاروا الخميس:</p>
    ${eventPicker("#/p")}
  </section>`;
}
function vPAbout(){
  const e=evById(currentEventId()), t=track(e.track);
  return `<section class="wrap page">${back("#/p","أولياء الأمور")}${stepMap(P_STEPS,0)}${eventPicker("#/p/about")}
    <article class="evcard" style="--c:${t.c}"><div class="evhead"><span class="evic">${t.ic}</span><div><h2>${esc(e.title)}</h2><div class="meta">${statusChip(e.status)} 📅 ${esc(e.date)} · 🎓 ${esc(e.stage)}</div></div></div>
    <h4>🎯 هدف الفعالية</h4><p>${esc(e.goal)}</p>${e.summary?`<h4>📝 ماذا حدث؟</h4><p>${esc(e.summary)}</p>`:""}
    <div class="acts"><a class="btn hot" href="#/p/support">كيف أدعم ابنتي؟ ←</a></div></article></section>`;
}
function vPSupport(){
  const e=evById(currentEventId()), t=track(e.track);
  return `<section class="wrap page">${back("#/p","أولياء الأمور")}${stepMap(P_STEPS,1)}${eventPicker("#/p/support")}
    <div class="box hl" style="--c:${t.c}"><h3>🤲 دعمكم في ${esc(t.name)}</h3><p>${esc(e.tasks.parents)}</p>
    <ul class="ticks"><li>اسألوها: ما دوركِ في هذا الخميس؟</li><li>بعد الفعالية: ما أجمل شيء تعلّمتِه؟</li><li>شجّعوها على الإجابة عن الاختبار البعدي ورأيها.</li></ul>
    <a class="btn hot" href="#/p/form">شاركونا ما لاحظتموه ←</a></div></section>`;
}
function vPForm(){
  const e=evById(currentEventId()), t=track(e.track), Q=QUESTIONS[e.id]||{parentObs:["حدّثتني عمّا تعلّمته","بادرت بالمشاركة","لم أتمكن من الملاحظة"],parentSupport:"هل ساعدت الأسرة ابنتها في الاستعداد؟"};
  const classes=[].concat(...Object.values(CONFIG.classes)), L=S.links[e.id]||{};
  return `<section class="wrap page">${back("#/p","أولياء الأمور")}${stepMap(P_STEPS,2)}${eventPicker("#/p/form")}
    <form class="box" data-form="parent"><h3>💬 رأيكم بعد ${esc(t.name)}</h3>
      <label>فصل الابنة (اختياري)<select name="cls"><option value="">—</option>${classes.map(c=>`<option>${c}</option>`).join("")}</select></label>
      <b class="lbl">ماذا لاحظتم في المنزل؟ (يمكن اختيار أكثر من خيار)</b>
      <div class="chips col">${Q.parentObs.map(o=>`<label class="pill"><input type="checkbox" name="obs" value="${o}"><span>${o}</span></label>`).join("")}</div>
      <b class="lbl">${esc(Q.parentSupport)}</b>
      <div class="chips">${["نعم","لا","لا ينطبق"].map(o=>`<label class="pill"><input type="radio" name="support" value="${o}" required><span>${o}</span></label>`).join("")}</div>
      <div class="satbox"><h3>😍 قياس الرضا</h3><p class="qt">ما مدى رضاكم عن الفعالية؟</p>${facesInput("sat").replace(/راضية/g,"راضٍ")}</div>
      <label>ملاحظة أو اقتراح (اختياري)<textarea name="note" rows="2" maxlength="300"></textarea></label>
      <button class="btn hot big">إرسال</button>
      ${saveBadge()}
    </form></section>`;
}

/* ================= لوحة النقاط والشارات ================= */
function vBoard(){
  const entries = Object.entries(S.board).sort((a,b)=>b[1]-a[1]);
  const max = Math.max(1,...entries.map(x=>x[1]));
  return `<section class="wrap page">${back("#/","الرئيسية")}
    ${banner("النقاط والشارات","أي فصل يتصدّر؟ واكتشفي شاراتك برمزك.")}
    <div class="grid2">
      <div class="box">
        <h3>🏆 ترتيب الفصول</h3>
        ${entries.length?`<div class="bars">${entries.map(([c,p],i)=>`<div class="brow"><span class="bc">${i===0?"🥇":i===1?"🥈":i===2?"🥉":""} ${esc(c)}</span><div class="bt"><div style="width:${p/max*100}%"></div></div><b>${AR(p)}</b></div>`).join("")}</div>`:`<div class="empty">⏳ بانتظار أول رصد للنقاط من فريق المبادرة.</div>`}
        <h4>كيف تُحسب النقاط؟</h4>
        <table class="tbl">${POINTS.map(p=>`<tr><td>${p.t}</td><td><b>+${AR(p.p)}</b></td></tr>`).join("")}</table>
        <p class="small">مثال: اقترحت طالبة فكرة فاختيرت ونُفّذت → يحصل فصلها على ٥ نقاط، وتحصل هي على شارة «صاحبة فكرة».</p>
      </div>
      <div class="box">
        <h3>🎖️ شاراتي</h3>
        <form data-form="badges">${codePicker()}<button class="btn hot">اعرضي شاراتي</button></form>
        <div data-badges></div>
        <h4>الشارات</h4>
        <div class="bgrid">${BADGES.map(b=>`<div><span>${b.e}</span><b>${b.k}</b><small>${b.d}</small></div>`).join("")}</div>
      </div>
    </div></section>`;
}

/* ================= التحليل ================= */
function score(kind, evId, ans){
  const qs = QUESTIONS[evId] && QUESTIONS[evId][kind]; if(!qs) return null;
  let c=0; qs.forEach((q,i)=>{ if(+ans["q"+i]===q.a) c++; }); return c/qs.length*100;
}
function analyze(resp){
  const out = {};
  for(const e of S.events){
    const R = resp.filter(r=>r.event_id===e.id);
    const pre={}, post={};
    R.filter(r=>r.kind==="pre").forEach(r=>{ const s=r.payload.score!=null?r.payload.score:score("pre",e.id,r.payload); if(s!=null) pre[r.payload.code]=s; });
    R.filter(r=>r.kind==="post").forEach(r=>{ const s=r.payload.score!=null?r.payload.score:score("post",e.id,r.payload); if(s!=null) post[r.payload.code]=s; });
    const matched = Object.keys(pre).filter(c=>post[c]!=null);
    const gs = matched.filter(c=>pre[c]<100).map(c=>(post[c]-pre[c])/(100-pre[c]));
    const mean = a => a.length? a.reduce((x,y)=>x+y,0)/a.length : null;
    const posts = R.filter(r=>r.kind==="post");
    const cls = S.classify||{};
    const written = posts.flatMap(r=>[["deep",r],["spec",r]].filter(([k])=>r.payload[k]).map(([k])=>cls[r.ts+"|"+k]));
    const classified = written.filter(Boolean);
    const teach = R.filter(r=>r.kind==="teacher");
    const Q = QUESTIONS[e.id]||{teacherInd:[]};
    let sk=0,skC=0,va=0,vaC=0; const skillsClear=new Set();
    teach.forEach(r=>Q.teacherInd.forEach((ind,i)=>{ const v=r.payload["ind"+i]; if(!v) return;
      if(VALUE_IND.has(ind)){ va++; if(v==="واضح") vaC++; } else { sk++; if(v==="واضح"){ skC++; skillsClear.add(ind);} } }));
    const par = R.filter(r=>r.kind==="parent");
    const parObs = par.filter(r=>{const o=r.payload.obs||[]; return o.length && !(o.length===1 && o[0]==="لم أتمكن من الملاحظة");});
    const parPos = parObs.filter(r=>(r.payload.obs||[]).some(o=>o!=="لم أتمكن من الملاحظة"));
    const sat = arr => { const v=arr.map(r=>+r.payload.sat).filter(Boolean); return {n:v.length, pos:pct(v.filter(x=>x>=4).length,v.length), dist:[1,2,3,4,5].map(k=>v.filter(x=>x===k).length)}; };
    const talentFields = new Set(); let talentCount=0;
    teach.forEach(r=>{ (r.payload.talents||[]).forEach(x=>talentFields.add(x)); talentCount += +r.payload.talentCount||0; });
    out[e.id] = {
      nPre:Object.keys(pre).length, nPost:Object.keys(post).length, nMatched:matched.length,
      preMean:mean(matched.map(c=>pre[c])), postMean:mean(matched.map(c=>post[c])), g:mean(gs), nG:gs.length,
      written:written.length, classified:classified.length, expressed:pct(classified.filter(x=>x==="عميق"||x==="محدد").length, classified.length),
      teacherN:teach.length, skills:pct(skC,sk), values:pct(vaC,va), skillsClear:[...skillsClear],
      parentN:par.length, parentObsN:parObs.length, parentPos:pct(parPos.length,parObs.length),
      satS:sat(posts), satT:sat(teach), satP:sat(par),
      talentFields:[...talentFields], talentCount,
      roles:R.filter(r=>r.kind==="role").length, leadRoles:R.filter(r=>r.kind==="role"&&/قائدة|فريق|مقدّمة|منظّمة|مصممة/.test(r.payload.role)).length,
      ideas:R.filter(r=>r.kind==="idea").length,
      improve: teach.map(r=>r.payload.improve).filter(Boolean).concat(posts.map(r=>r.payload.improve).filter(Boolean))
    };
  }
  return out;
}
function overall(A){
  // تجميع على مستوى الفصل للمؤشرات
  const ids = Object.keys(A); const m={};
  const wavg = (key, nkey) => { let s=0,n=0; ids.forEach(i=>{ if(A[i][key]!=null){ s+=A[i][key]*(A[i][nkey]||1); n+=(A[i][nkey]||1);} }); return n? {v:s/n, n} : null; };
  m.gain = wavg("g","nG");
  m.expressed = wavg("expressed","classified");
  m.skills = wavg("skills","teacherN");
  m.values = wavg("values","teacherN");
  m.parents = wavg("parentPos","parentObsN");
  const sv=new Set(); ids.forEach(i=>A[i].skillsClear.forEach(x=>sv.add(x))); m.skillvar = sv.size?{v:sv.size,n:ids.reduce((a,i)=>a+A[i].teacherN,0)}:null;
  const tf=new Set(); let tc=0; ids.forEach(i=>{A[i].talentFields.forEach(x=>tf.add(x)); tc+=A[i].talentCount;}); m.talents = (tc||tf.size)?{v:tc, fields:tf.size, n:ids.reduce((a,i)=>a+A[i].teacherN,0)}:null;
  const satAll = k => { let pos=0,n=0; ids.forEach(i=>{ const s=A[i][k]; if(s.n){ pos+=s.pos*s.n/100; n+=s.n; } }); return n?{v:pos/n*100,n}:null; };
  m.satS=satAll("satS"); m.satT=satAll("satT"); m.satP=satAll("satP");
  return m;
}
function mergeSat(k){ const ev=(S.published&&S.published.events)||{}; const d=[0,0,0,0,0]; Object.values(ev).forEach(x=>x[k]&&x[k].dist.forEach((v,i)=>d[i]+=v)); const n=d.reduce((a,b)=>a+b,0); return {n,dist:d,pos:n?(d[3]+d[4])/n*100:null}; }
function publishedFor(id){ return S.published && S.published.events ? S.published.events[id] : null; }

function cell(v, unit, pending="بانتظار البيانات"){
  return v==null ? `<span class="pending">⏳ ${pending}</span>` : `<b class="val">${v}${unit||""}</b>`;
}
function satPanel(a){
  const rows=[["🎒 الطالبات",a&&a.satS],["👩‍🏫 المعلمات",a&&a.satT],["🏡 أولياء الأمور",a&&a.satP]];
  return `<div class="satbox"><h3>😍 قياس الرضا</h3>${rows.map(([k,x])=>`<div class="satrow"><b>${k}</b>${x&&x.n?`<div class="sfaces">${FACES.map((f,i)=>`<span title="${f.t}">${f.e}<small>${AR(x.dist[i])}</small></span>`).join("")}</div><b class="val">${AR(Math.round(x.pos))}٪</b>`:`<span class="pending">⏳ بانتظار البيانات</span>`}</div>`).join("")}<p class="small">النسبة = «راضية» + «راضية جدًا» · المستهدف ٨٠٪</p></div>`;
}
function eventResultsBlock(id){
  const e=evById(id), t=track(e.track), a=publishedFor(id), r=S.records[id]||{};
  const n = x => x==null?null:AR(Math.round(x*10)/10);
  const g = a&&a.g!=null ? AR(a.g.toFixed(2)) : null;
  return `<div class="box hl" style="--c:${t.c}">
    <h3>📊 نتائج ${esc(t.name)} المجمّعة</h3>
    ${!a?`<p class="pending big">⏳ بانتظار البيانات</p>`:""}
    <div class="kpis">
      <div><small>متوسط القبلي</small>${cell(a&&a.preMean!=null?n(a.preMean):null,"٪")}</div>
      <div><small>متوسط البعدي</small>${cell(a&&a.postMean!=null?n(a.postMean):null,"٪")}</div>
      <div><small>مكسب التعلّم g</small>${cell(g)}<small class="tg">المستهدف ٠٫٣</small></div>
      <div><small>مستوى التعلّم التأمّلي</small>${cell(a&&a.expressed!=null?n(a.expressed):null,"٪")}<small class="tg">المستهدف ٦٠٪</small></div>
      <div><small>مؤشرات المهارات (واضح)</small>${cell(a&&a.skills!=null?n(a.skills):null,"٪")}</div>
      <div><small>مؤشرات القيم (واضح)</small>${cell(a&&a.values!=null?n(a.values):null,"٪")}</div>
    </div>
    ${satPanel(a)}
    ${a?`<p class="small">عدد الردود: قبلي ${AR(a.nPre)} · بعدي ${AR(a.nPost)} · متطابقة ${AR(a.nMatched)} · بطاقات ملاحظة ${AR(a.teacherN)} · أولياء أمور ${AR(a.parentN)}</p>`:""}
    <h4>🧾 سجل التنفيذ</h4>
    <div class="kpis">
      <div><small>الحضور</small>${cell(r.attendance?AR(r.attendance):null)}</div>
      <div><small>المشاركات</small>${cell(r.participants?AR(r.participants):null)}</div>
      <div><small>أدوار قيادية</small>${cell(r.leaders?AR(r.leaders):null)}</div>
      <div><small>مواهب ظهرت</small>${cell(r.talents?AR(r.talents):null)}</div>
    </div>
    ${r.source?`<p class="small">مصدر الأرقام: ${esc(r.source)}</p>`:""}
    ${e.summary?`<h4>📝 ماذا حدث؟</h4><p>${esc(e.summary)}</p>`:""}
    <h4>🔧 إجراء التحسين للخميس القادم</h4>${r.improvement?`<p>${esc(r.improvement)}</p>`:`<p class="pending">⏳ لم يُضف بعد</p>`}
  </div>`;
}

/* ================= بصمة الأثر ================= */
function vImpact(){
  const P = S.published && S.published.overall || {};
  const M = S.impact || {};
  const n1 = v => AR(Math.round(v*10)/10);
  const auto = {
    gain: P.gain?{v:AR(P.gain.v.toFixed(2)),n:P.gain.n}:null,
    expressed: P.expressed?{v:n1(P.expressed.v)+"٪",n:P.expressed.n}:null,
    skills: P.skills?{v:n1(P.skills.v)+"٪",n:P.skills.n}:null,
    values: P.values?{v:n1(P.values.v)+"٪",n:P.values.n}:null,
    parents: P.parents?{v:n1(P.parents.v)+"٪",n:P.parents.n}:null,
    skillvar: P.skillvar?{v:AR(P.skillvar.v)+" مهارات",n:P.skillvar.n}:null,
    talents: P.talents?{v:AR(P.talents.v)+" موهبة في "+AR(P.talents.fields)+" مجالات",n:P.talents.n}:null,
    satis: (P.satS||P.satT||P.satP)?{v:[["الطالبات",P.satS],["المعلمات",P.satT],["أولياء الأمور",P.satP]].map(([k,x])=>k+": "+(x?n1(x.v)+"٪":"⏳")).join(" · "), n:[P.satS,P.satT,P.satP].reduce((a,x)=>a+(x?x.n:0),0)}:null
  };
  const recs=Object.values(S.records); const sum=k=>recs.reduce((x,r)=>x+(+r[k]||0),0);
  if(sum("participants")&&sum("leaders")) auto.leaders={v:n1(sum("leaders")/sum("participants")*100)+"٪", n:sum("participants")};
  const oursDone=S.events.filter(e=>e.track==="ours"&&e.status==="منفّذة").length; if(oursDone) auto.ideas={v:AR(oursDone)+" فعالية",n:oursDone};
  if(!auto.talents && sum("talents")) auto.talents={v:AR(sum("talents"))+" موهبة", n:recs.length};
  // التنوع يُحسب من الفعاليات المنفّذة
  const byMonth={}; S.events.filter(e=>e.status==="منفّذة").forEach(e=>{const k=e.iso.slice(0,7); (byMonth[k]=byMonth[k]||new Set()).add(e.track);});
  const months=Object.entries(byMonth);
  if(months.length) auto.diversity={v:months.map(([k,s])=>AR(s.size)+" نوع ("+AR(k.slice(5))+"/"+AR(k.slice(0,4))+")").join(" · "), n:months.length};
  const domains=[...new Set(INDICATORS.map(i=>i.dom))];
  const domIc={"الحضور":"🏫","المشاركة":"🙋‍♀️","المعرفة":"🧠","المهارات":"🛠️","القيم":"💎","المواهب":"🌟","القيادة":"👑","الانتماء":"❤️","الرضا":"😍"};
  return `<section class="wrap page">${back("#/","الرئيسية")}
    ${banner("بصمة الأثر","نتائج المبادرة مجمّعة دون بيانات فردية.")}
    <div class="baseline">${(S.impact.belong&&S.impact.belong.baseline)?`✅ القياس القبلي للفصل متاح`:`⏳ بانتظار بيانات القياس القبلي`}</div>
    ${satPanel(S.published?{satS:mergeSat("satS"),satT:mergeSat("satT"),satP:mergeSat("satP")}:null)}
    ${domains.map(d=>`<h3 class="domh">${domIc[d]||"•"} ${d}</h3><div class="inds">${INDICATORS.filter(i=>i.dom===d).map(i=>{
      const man=M[i.id]||{}; const a=auto[i.id];
      let val=null, n=null, period=man.period||"الفصل الأول ١٤٤٨هـ";
      if(man.value){ val=esc(man.value); n=man.n||null; } else if(a){ val=a.v; n=a.n; }
      let diff="";
      if(man.baseline && man.value && !isNaN(parseFloat(man.baseline)) && !isNaN(parseFloat(man.value))){
        const b=parseFloat(man.baseline), v=parseFloat(man.value);
        diff = i.id==="absence" && b ? `<small class="diff">التغيّر النسبي: ${AR(((v-b)/b*100).toFixed(1))}٪</small>` : `<small class="diff">الفرق: ${AR((v-b).toFixed(1))} نقطة</small>`;
      }
      return `<div class="ind"><div class="ih"><b>${i.n}</b><span class="tgt">🎯 ${i.tgt}</span></div>
        <div class="iv">${cell(val)}</div>${diff}
        <div class="im"><span>📂 ${i.src}</span><span>🗓️ ${esc(period)}</span><span>👥 ${n!=null?"الردود: "+AR(n):"الردود: —"}</span></div>
        </div>`;}).join("")}</div>`).join("")}
    <div class="box"><h3>🌱 الأثر النوعي وإجراء التحسين</h3>
      ${S.events.filter(e=>e.status==="منفّذة").map(e=>{const r=S.records[e.id]||{}; return `<p><b>${esc(track(e.track).name)}:</b> ${e.summary?esc(e.summary):'<span class="pending">⏳ بانتظار الملخص</span>'}<br><b>إجراء التحسين:</b> ${r.improvement?esc(r.improvement):'<span class="pending">⏳ لم يُضف بعد</span>'}</p>`}).join("")||'<p class="pending">⏳ بانتظار البيانات</p>'}
    </div>
    ${S.published?`<p class="small">آخر نشر للنتائج: ${new Date(S.published.at).toLocaleString("ar-SA")}</p>`:""}
  </section>`;
}

/* ================= الشواهد وعن المبادرة ================= */
function vEvidence(){
  return `<section class="wrap page">${back("#/","الرئيسية")}${banner("معرض الشواهد","صور كل خميس وأعماله.")}
    
    <div class="grid2">${S.events.filter(e=>e.status!=="مسودة").map(e=>{const t=track(e.track),L=S.links[e.id]||{};return `<div class="box hl" style="--c:${t.c}"><h3>${t.ic} ${esc(e.title)}</h3><p class="small">${esc(e.date)} · ${statusChip(e.status)}</p>${L.padlet?linkBtn(L.padlet,"شاهدي الصور","btn hot"):`<span class="pending">📷 تُضاف الصور بعد الفعالية</span>`}</div>`}).join("")}</div>
  </section>`;
}
function vAbout(){
  return `<section class="wrap page">${back("#/","الرئيسية")}${banner("عن المبادرة","الفكرة والرؤية والرسالة وطريقة القياس.")}
  <div class="vm"><div class="vmc"><h3>الرؤية</h3><p>خميسٌ تنتظره كل طالبة؛ تتعلّم فيه وتقود وتُبدع، وتكتشف موهبتها في مدرسة جاذبة.</p></div><div class="vmc c2"><h3>الرسالة</h3><p>فعاليات أسبوعية متنوعة تصنعها الطالبات بإشراف المعلمات وشراكة الأسرة، تنمّي المهارات والقيم والمواهب والقيادة، ونقيس أثرها لنطوّرها باستمرار.</p></div></div>
  <div class="vals">${["المشاركة","الإبداع","الانتماء","الاحترام","المسؤولية"].map(v=>`<span>${v}</span>`).join("")}</div>
  <div class="box"><h3>الفكرة</h3><p>«خميسنا أحلى» مبادرة مدرسية ممتدة تخصّص يوم الخميس لفعاليات متنوعة تجمع التعلّم والمتعة والمشاركة، وتمنح طالبات المرحلتين المتوسطة والثانوية دورًا في اقتراح الفعاليات واختيارها والتخطيط لها وتنظيمها وتقديمها وتوثيقها.</p></div>
  <div class="box"><h3>📏 كيف نقيس الأثر؟</h3>
    <div class="mgrid">
      <div><span>🧠</span><b>المعرفة</b><small>اختبار قبلي وبعدي لكل خميس.</small></div>
      <div><span>✍️</span><b>مستوى التعلّم التأمّلي</b><small>سؤالان كتابيان: «كنتُ أظن… والآن…» ومعلومة أو مهارة محددة.</small></div>
      <div><span>🛠️</span><b>المهارات والقيم</b><small>بطاقة ملاحظة المعلمة لكل فصل.</small></div>
      <div><span>🏡</span><b>الأسرة</b><small>ما لاحظه ولي الأمر في المنزل، مع خيار «لم أتمكن من الملاحظة».</small></div>
      <div><span>😍</span><b>الرضا</b><small>خمسة وجوه تعبيرية لكل فئة.</small></div>
      <div><span>🧾</span><b>السجلات</b><small>الحضور والمشاركة والأدوار والمواهب، مع مصدر كل رقم.</small></div>
    </div></div>
  <div class="box"><h3>🧰 الأدوات الرقمية</h3>
    <table class="tbl">
      <tr><td><b>Excel</b></td><td>تصدير الردود والنتائج من لوحة الفريق.</td></tr>
      <tr><td><b>Copilot</b></td><td>للفريق والمعلمات فقط: مقارنة القبلي بالبعدي وتصنيف الإجابات الكتابية.</td></tr>
      <tr><td><b>Padlet</b></td><td>إعلان كل خميس وصوره وشواهده.</td></tr>
      <tr><td><b>منصة مدرستي</b></td><td>نشر إعلان الفعالية ورابطها فقط.</td></tr>
    </table></div>
  <div class="box"><h3>🔐 الخصوصية</h3><ul class="ticks"><li>لا أسماء: كل طالبة برمز (الفصل + رقم الكشف + أول حرفين من الاسم).</li><li>يُعرض للزوار النتائج المجمّعة فقط.</li><li>بطاقة الملاحظة لكل فصل لا لكل طالبة.</li><li>الردود الفردية لا يطّلع عليها إلا فريق المبادرة عبر الرقم السري.</li></ul></div>
  </section>`;
}

/* ================= لوحة الفريق ================= */
let teamTab = "before";
const hint = t => `<small class="hint">${t}</small>`;
function vTeam(){
  if(!STORE.isAdmin()) return `<section class="wrap page">${back("#/","الرئيسية")}${banner("فريق المبادرة","لوحة التحكم · الدخول بالرقم السري")}
    <form class="box login" data-form="login"><h3>🔑 أدخلي الرقم السري</h3><input name="pin" type="password" inputmode="numeric" autocomplete="current-password" required placeholder="••••"><button class="btn hot">دخول</button>
    <p class="small">${STORE.shared?"🟢 يُتحقق من الرقم على الخادم.":"🟡 وضع المعاينة: التحقق على هذا الجهاز."}</p></form></section>`;
  const tabs=[["before","١. قبل الخميس"],["after","٢. بعد الخميس"],["extra","إضافي"]];
  const q = new URLSearchParams((location.hash.split("?")[1]||"")); if(q.get("tab")) teamTab=q.get("tab");
  if(!["before","after","extra"].includes(teamTab)) teamTab="before";
  return `<section class="wrap page">${back("#/","الرئيسية")}
    ${banner("لوحة فريق المبادرة","مهمتان لكل خميس: قبله وبعده")}
    <div class="teamhead"><button class="btn ghost sm" data-act="logout">خروج</button></div>
    <div class="tabs">${tabs.map(([k,l])=>`<button class="tab ${k===teamTab?"on":""}" data-act="tab" data-tab="${k}">${l}</button>`).join("")}</div>
    <div class="tabbody">${({before:tBefore,after:tAfter,extra:tExtra})[teamTab]()}</div>
  </section>`;
}
function guideBox(title, steps){ return `<div class="guide"><b>${title}</b><ol>${steps.map(x=>`<li>${x}</li>`).join("")}</ol></div>`; }
function tBefore(){
  return guideBox("المطلوب قبل كل خميس (مرة واحدة لكل فعالية):",[
    "اختاري الفعالية أو أضيفي فعالية جديدة.",
    "اكتبي العنوان والموعد، واجعلي الحالة «مجدولة» ليظهر الخميس للطالبات.",
    "اكتبي الهدف وما المطلوب من كل فئة في سطر أو سطرين.",
    "ضعي رابط لوحة Padlet التي فيها إعلان الفعالية، ثم اضغطي «حفظ»."])
  + S.events.map((e,i)=>evForm(e,i)).join("")
  + `<button class="btn" data-act="add-ev">＋ إضافة فعالية جديدة</button>`;
}
function evForm(e,i){
  const L=S.links[e.id]||{};
  return `<details class="box evedit" ${i===S.events.length-1&&e.status==="مسودة"?"open":""}><summary>${track(e.track).ic} <b>${esc(e.title)}</b> ${statusChip(e.status)}</summary>
  <form data-form="ev" data-i="${i}">
    <div class="row2">
      <label>عنوان الفعالية<input name="title" value="${esc(e.title)}" required>${hint("يظهر للطالبات والمعلمات وأولياء الأمور.")}</label>
      <label>نوع الخميس<select name="track">${TRACKS.map(t=>`<option value="${t.id}" ${t.id===e.track?"selected":""}>${t.name}</option>`).join("")}</select>${hint("يحدد البطاقة التي تظهر فيها الفعالية في الرئيسية.")}</label>
      <label>الحالة<select name="status">${["مسودة","مجدولة","منفّذة"].map(s=>`<option ${s===e.status?"selected":""}>${s}</option>`).join("")}</select>${hint("مسودة: لا تظهر للزوار · مجدولة: قبل الموعد · منفّذة: بعد التنفيذ.")}</label>
      <label>المرحلة المستهدفة<select name="stage">${["المتوسطة","الثانوية","المتوسطة والثانوية"].map(s=>`<option ${s===e.stage?"selected":""}>${s}</option>`).join("")}</select></label>
      <label>الموعد كما يُكتب<input name="date" value="${esc(e.date)}" placeholder="الخميس ٩ / ٦ / ١٤٤٨هـ">${hint("النص الذي يظهر في الموقع.")}</label>
      <label>تاريخ الفعالية من التقويم<input type="date" name="iso" value="${esc(e.iso)}">${hint("يستخدمه الموقع للعدّ التنازلي فقط.")}</label>
    </div>
    <label>الهدف<textarea name="goal" rows="2">${esc(e.goal)}</textarea>${hint("جملة واحدة: ماذا نريد أن تتعلم الطالبة أو تمارس؟")}</label>
    <label>المطلوب من الطالبات<textarea name="t_students" rows="2">${esc(e.tasks.students)}</textarea>${hint("يظهر للطالبة في «خميس هذا الأسبوع».")}</label>
    <label>المطلوب من المعلمات<textarea name="t_teachers" rows="2">${esc(e.tasks.teachers)}</textarea>${hint("يظهر للمعلمة في «دليل التنفيذ».")}</label>
    <label>المطلوب من أولياء الأمور<textarea name="t_parents" rows="2">${esc(e.tasks.parents)}</textarea>${hint("يظهر في «كيف تدعمون ابنتكم؟».")}</label>
    <label>رابط لوحة Padlet للفعالية<input name="padlet" type="url" dir="ltr" value="${esc(L.padlet||"")}" placeholder="https://padlet.com/...">${hint("انسخيه من زر «مشاركة» في Padlet. تجد فيه الطالبات إعلان الفعالية، ثم صورها بعد التنفيذ.")}</label>
    ${QUESTIONS[e.id]?`<p class="small">✅ الاختبار القبلي والبعدي جاهزان لهذه الفعالية.</p>`:`<p class="small warn">⚠️ لا توجد أسئلة قبلي/بعدي لهذه الفعالية بعد — اطلبيها من Claude لتُضاف.</p>`}
    <button class="btn">حفظ</button>
  </form></details>`;
}
function autoCounts(id){
  if(!RESP) return null;
  const R=RESP.filter(r=>r.event_id===id && r.payload && r.payload.code);
  const part=new Set(R.filter(r=>r.kind==="role"||r.kind==="post").map(r=>r.payload.code));
  const lead=new Set(R.filter(r=>r.kind==="role"&&/قائدة|فريق|مقدّمة|منظّمة|مصممة/.test(r.payload.role||"")).map(r=>r.payload.code));
  return {part:part.size, lead:lead.size};
}
function tAfter(){
  return guideBox("المطلوب بعد كل خميس:",[
    "اكتبي عدد الحاضرات من كشف الحضور، وعدد الأدوار القيادية بعد التحقق. عدد المشاركات يقترحه الموقع، وعدّليه إن اختلف عن الواقع.",
    "اكتبي ملخصًا قصيرًا لما حدث، وإجراءً واحدًا لتحسين الخميس القادم.",
    "غيّري حالة الفعالية إلى «منفّذة» (من تبويب «قبل الخميس»).",
    "اضغطي «احسبي وانشري النتائج» في الأسفل؛ يحسب الموقع الاختبارات والرضا والملاحظات وحده."])
  + S.events.filter(e=>e.status!=="مسودة").map(e=>{const r=S.records[e.id]||{}; const ac=autoCounts(e.id);
    const pv = r.participants!==undefined && r.participants!=="" ? r.participants : (ac&&ac.part?ac.part:"");
    const lv = r.leaders||"";
    const sug = (n,what) => ac ? `<small class="auto">🤖 عدّ الموقع: <b>${AR(n)}</b> ${what}${n?" — عدّليه إن اختلف عن الواقع.":""}</small>` : `<small class="auto">جارٍ العدّ…</small>`;
    return `<form class="box" data-form="rec" data-id="${e.id}"><h4>${track(e.track).ic} ${esc(e.title)} ${statusChip(e.status)}</h4>
    <div class="row2">
      <label>عدد الحاضرات يوم الفعالية<input type="number" min="0" name="attendance" value="${esc(r.attendance||"")}">${hint("من كشف الحضور الرسمي.")}</label>
      <label>عدد المشاركات<input type="number" min="0" name="participants" value="${esc(pv)}">${sug(ac?ac.part:0,"طالبة سجّلت دورها أو أجابت عن البعدي (كل طالبة مرة واحدة)")}${hint("أضيفي من شاركت ولم تدخل الموقع.")}</label>
      <label>عدد من تولّين دورًا قياديًا<input type="number" min="0" name="leaders" value="${esc(lv)}">${hint("يكتبه الفريق بعد التحقق من الواقع: تخطيط أو تنظيم أو تقديم.")}</label>
      <label>عدد المواهب التي ظهرت<input type="number" min="0" name="talents" value="${esc(r.talents||"")}">${hint("مثل الإلقاء والرسم والتصميم والطبخ.")}</label>
    </div>
    <label>مصدر الأرقام<input name="source" value="${esc(r.source||"")}" placeholder="كشف الحضور + سجل الفريق">${hint("من أين أخذتِ الأرقام؟ يظهر بجانبها في النتائج.")}</label>
    <label>ماذا حدث؟ (ملخص قصير)<textarea name="summary" rows="3">${esc(e.summary||"")}</textarea>${hint("ثلاثة أسطر: ماذا نُفّذ، وما الذي لفت انتباهكن. يظهر للجميع.")}</label>
    <label>إجراء التحسين للخميس القادم<textarea name="improvement" rows="2">${esc(r.improvement||"")}</textarea>${hint("إجراء واحد واضح، مثل: زيادة وقت الأركان ١٠ دقائق.")}</label>
    <button class="btn">حفظ</button></form>`}).join("")
  + `<div class="box hl"><h4>📤 احسبي وانشري النتائج</h4>${hint("يحسب من ردود الطالبات والمعلمات وأولياء الأمور: الاختبارات والرضا والمهارات والقيم، وينشرها مجمّعة في «بصمة الأثر» دون أسماء. اضغطيه بعد كل خميس، ويمكن تكراره.")}<button class="btn hot" data-act="publish">احسبي وانشري النتائج</button></div>`;
}
function tExtra(){
  const classes=[].concat(...Object.values(CONFIG.classes));
  const M=S.impact||{};
  const manual=[["absence","غياب الخميس","متوسط نسبة الغياب أيام الخميس من نظام نور. اكتبي قبل المبادرة في «خط الأساس» وأثناءها في «القيمة»."],["monthly","المشاركة الشهرية","نسبة الطالبات اللاتي شاركن مرة على الأقل في الشهر."],["sustain","استدامة المشاركة","نسبة من شاركن في خميسين أو أكثر."],["belong","الحماس والانتماء","نسبة «دائمًا/غالبًا» في الاستبانة القبلية (خط الأساس) والبعدية (القيمة)."]];
  let html = `<p class="small">هذه الأقسام ليست مطلوبة كل خميس؛ استخدميها عند الحاجة.</p>`;
  html += `<details class="box"><summary><b>🏅 نقاط الفصول والشارات</b> ${hint("عند الرغبة في تحفيز الفصول")}</summary>
    <form data-form="points"><div class="row2">
      <label>الفصل<select name="cls">${classes.map(c=>`<option>${c}</option>`).join("")}</select></label>
      <label>السبب<select name="reason">${POINTS.map(p=>`<option value="${p.k}">${p.t} (+${p.p})</option>`).join("")}</select></label>
      <label>العدد<input type="number" name="count" min="1" value="1">${hint("مثال: ٥ طالبات شاركن ← اكتبي ٥.")}</label></div><button class="btn">رصد النقاط</button></form>
    <p class="small">الرصيد: ${Object.keys(S.board).length?Object.entries(S.board).sort((a,b)=>b[1]-a[1]).map(([c,p])=>`<span class="tag">${esc(c)}: ${AR(p)}</span>`).join(" "):"لا نقاط بعد."}</p>
    <form data-form="badge-give"><div class="row2">
      <label>رمز الطالبة<input name="code" required placeholder="٢م-٠٥-فا">${hint("تجدينه في ردودها أو تسألينها عنه.")}</label>
      <label>الشارة<select name="badge">${BADGES.map(b=>`<option>${b.k}</option>`).join("")}</select></label></div><button class="btn">منح الشارة</button></form></details>`;
  html += `<details class="box" data-act="open-resp"><summary><b>✍️ تصنيف إجابات «ماذا تعلّمتِ؟»</b> ${hint("لحساب مؤشر مستوى التعلّم التأمّلي — يمكن تأجيله")}</summary><div data-resp>${respBlock()}</div></details>`;
  html += `<details class="box"><summary><b>📈 مؤشرات آخر الفصل</b> ${hint("تُعبّأ مرة واحدة في نهاية الفصل")}</summary><form data-form="impact">
    ${manual.map(([id,n,h])=>{const m=M[id]||{};return `<fieldset class="mi"><legend>${n}</legend>${hint(h)}<div class="row2">
      <label>خط الأساس (قبل)<input name="${id}_baseline" value="${esc(m.baseline||"")}"></label>
      <label>القيمة المحققة<input name="${id}_value" value="${esc(m.value||"")}"></label></div></fieldset>`}).join("")}
    <button class="btn">حفظ المؤشرات</button></form></details>`;
  html += `<details class="box"><summary><b>📣 لوحة الطالبات: فكرة الشهر وموهبة الخميس</b> ${hint("تظهر للطالبات في «إنجازاتي وشاراتي ونقاط فصلي»")}</summary>
    <form data-form="hilite">${hint("اكتبي دون أسماء كاملة، مثل: «خميس الألعاب الذهنية — فكرة طالبة من ٢م».")}
    <label>فكرة الشهر<input name="idea" value="${esc((S.highlights||{}).idea||"")}" maxlength="120"></label>
    <label>موهبة الخميس<input name="talent" value="${esc((S.highlights||{}).talent||"")}" maxlength="120" placeholder="مثال: الإلقاء — طالبة من ٣م في خميس الثقافات"></label>
    <button class="btn">حفظ</button></form></details>`;
  html += `<details class="box"><summary><b>🔐 رموز دخول المعلمات وأولياء الأمور</b> ${hint("تمنع الطالبات من دخول صفحتي المعلمات وأولياء الأمور")}</summary>
    <form data-form="access">${hint("أرسلي رمز المعلمات في مجموعة المعلمات، ورمز أولياء الأمور في رسالة المدرسة لهم. إذا انتشر رمز بين الطالبات غيّريه هنا، فيُطلب الرمز الجديد من الجميع.")}
    <div class="row2"><label>رمز المعلمات الجديد<input name="t" inputmode="numeric" minlength="4" placeholder="اتركيه فارغًا إن لم تغيّريه"></label>
    <label>رمز أولياء الأمور الجديد<input name="p" inputmode="numeric" minlength="4" placeholder="اتركيه فارغًا إن لم تغيّريه"></label></div>
    <button class="btn">حفظ الرموز</button></form></details>`;
  html += `<details class="box"><summary><b>⬇️ التصدير والرقم السري</b></summary><div class="acts">
    <button class="btn" data-act="exp-csv">تصدير الردود إلى Excel</button><button class="btn ghost" data-act="print-report">تقرير للطباعة PDF</button></div>
    <form data-form="pin"><label>رقم سري جديد<input name="pin" type="password" minlength="4" required inputmode="numeric"></label><button class="btn">تغيير الرقم السري</button></form></details>`;
  return html;
}
function respBlock(){
  if(!RESP) return `<p class="small">جارٍ التحميل…</p>`;
  const posts=RESP.filter(r=>r.kind==="post"); const cls=S.classify||{};
  const ideas=RESP.filter(r=>r.kind==="idea");
  return `${hint("عميق: «كنت أظن… والآن…» بتغيّر واضح · محدد: معلومة أو مهارة واضحة · عام: كلام عام مثل «استمتعت».")}
    ${posts.length?`<div class="wlist">${posts.flatMap(r=>["deep","spec"].filter(k=>r.payload[k]).map(k=>{const key=r.ts+"|"+k;return `<div class="witem"><small>${esc(r.payload.code)} · ${esc((evById(r.event_id)||{}).title||"")}</small><p>${esc(r.payload[k])}</p><div class="chips">${["عميق","محدد","عام"].map(v=>`<button type="button" class="pill btnpill ${cls[key]===v?"on":""}" data-act="classify" data-key="${esc(key)}" data-v="${v}">${v}</button>`).join("")}</div></div>`})).join("")}</div>`:`<div class="empty">لا توجد إجابات بعد.</div>`}
    <h4>💡 أفكار الطالبات</h4>${ideas.map(r=>`<p>• ${esc(r.payload.idea)} <small>(${esc(r.payload.code)})</small></p>`).join("")||'<p class="small">لا توجد أفكار بعد.</p>'}`;
}

/* ================= دليل الاستخدام ================= */
const HELP = [
  ["من أين أبدأ؟","اضغطي مربع «الطالبات»، سجّلي بياناتك مرة واحدة، ثم ادخلي الخميس واتبعي خطواته بالترتيب من الأعلى للأسفل."],
  ["ما رمزي في المبادرة؟","فصلك + رقمك في الكشف + أول حرفين من اسمك، مثل ٢م-٠٥-فا. تختارينه من القوائم، ونستخدمه بدل الاسم لحماية خصوصيتك."],
  ["هل الاختبار القبلي له درجة؟","لا. هو لمعرفة ما تعرفينه قبل الفعالية، ثم نقارنه بالبعدي لنعرف ما تعلّمتِه. لا يؤثر في تحصيلك."],
  ["لماذا أكتب الرمز نفسه في القبلي والبعدي؟","حتى نقارن إجابتيكِ ونحسب مقدار تعلّمك. اكتبيه بالطريقة نفسها في المرتين."],
  ["كيف أكتب «كنتُ أظن… والآن…»؟","اكتبي فكرة كانت عندك قبل الخميس، ثم ما عرفتِه بعده. يظهر مثال تحت السؤال."],
  ["كيف يحصل فصلي على نقاط؟","مشاركة = ١، دور قيادي أو موهبة = ٣، فكرة نُفّذت = ٥، فكرة لم تُختر = ١. يرصدها فريق المبادرة."],
  ["كيف أعرف شاراتي؟","من «لوحة النقاط والشارات» اختاري رمزك واضغطي «اعرضي شاراتي»."],
  ["أين أشاهد صور الفعاليات؟","في «معرض الشواهد» بعد أن يضيفها فريق المبادرة."],
  ["أين أقيّم رضاي؟","داخل الخميس، في الخطوة ٣ بعد الاختبار البعدي: اختاري وجهًا من الوجوه الخمسة."],
  ["لماذا يُطلب رمز في صفحة المعلمات أو أولياء الأمور؟","حتى لا يدخلها غير أصحابها. تجدينه في رسالة فريق المبادرة، ويُطلب مرة واحدة على الجهاز."],
  ["أنا معلمة: هل أعبّئ بطاقة لكل طالبة؟","لا، بطاقة واحدة لكل فصل، وتأخذ دقيقتين."],
  ["ماذا تعني «ظهر بوضوح»؟","أغلب طالبات الفصل أظهرن السلوك أكثر من مرة دون توجيه. «جزئيًا»: عند بعضهن أو بتوجيه."],
  ["أنا ولي أمر ولم ألاحظ شيئًا","اختاروا «لم أتمكن من الملاحظة»، فهذا خيار صحيح ولا يُحسب سلبيًا."],
  ["لماذا تظهر «بانتظار البيانات»؟","لأن نتائج هذه الخانة لم تصل بعد. لا تعني صفرًا."],
  ["هل يرى الآخرون إجاباتي؟","لا. الزوار يرون النتائج المجمّعة فقط، والردود الفردية لفريق المبادرة."],
  ["كيف أقترح فكرة لخميس؟","ادخلي أي خميس، وفي آخر الصفحة «قدّمي فكرة». قد تصبح فكرتك «فكرة الشهر» وتنفّذينها مع فريقك."]
];
function helpModal(){
  return `<div class="modal" data-modal><div class="mbox"><div class="mhead"><b>📘 دليل الاستخدام</b><button class="x" data-act="help-close" aria-label="إغلاق">✕</button></div>
    <input class="hsearch" placeholder="ابحثي عن سؤال…" data-act="help-search">
    <div class="hlist">${HELP.map(([q,a])=>`<details class="hq"><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></div></div>`;
}


/* ================= رمز دخول المعلمات وأولياء الأمور ================= */
const GROUPS={t:{name:"المعلمات",who:"المعلمة",msg:"أدخلي رمز المعلمات الذي أرسله فريق المبادرة."},p:{name:"أولياء الأمور",who:"ولي الأمر",msg:"أدخلوا الرمز المرسل إليكم في رسالة المدرسة."}};
function accessVer(g){ return String((S.accessVer||{})[g]||0)+"|"+((S.access||{})[g]||""); }
function locked(g){ return KV.get("kh2_unlock_"+g)!==accessVer(g); }
function vGate(g){
  const G=GROUPS[g];
  return `<section class="wrap page">${back("#/","الرئيسية")}${banner(G.name,"الدخول برمز خاص")}
    <form class="box login" data-form="gate" data-g="${g}"><h3>🔑 رمز الدخول</h3><p class="small">${G.msg}</p>
    <input name="code" type="password" inputmode="numeric" required placeholder="••••"><button class="btn hot">دخول</button>
    <p class="small">يُطلب مرة واحدة على هذا الجهاز.</p></form></section>`;
}
/* ================= الموجّه ================= */
const ROUTES = {
  "":vHome, "about":vAbout, "s":vStudents, "s/ev":vSEvent, "s/week":vSEvent, "s/join":vSEvent, "s/pre":vSEvent, "s/post":vSEvent, "s/after":vSEvent,
  "t":vTeachers, "t/guide":vTGuide, "t/card":vTCard, "t/results":vTResults,
  "p":vParents, "p/about":vPAbout, "p/support":vPSupport, "p/form":vPForm,
  "board":vBoard, "impact":vImpact, "evidence":vEvidence, "team":vTeam
};
function path(){ return (location.hash.replace(/^#\/?/,"").split("?")[0]).replace(/\/$/,""); }
async function render(){
  const p = path();
  const g0 = p.split("/")[0];
  const v = (g0==="t"||g0==="p") && locked(g0) ? ()=>vGate(g0) : (ROUTES[p] || vHome);
  if(p==="team" && STORE.isAdmin() && RESP===null && (teamTab==="extra"||teamTab==="after")) loadResp();
  app.classList.remove("in");
  app.innerHTML = v();
  requestAnimationFrame(()=>app.classList.add("in"));
  document.querySelectorAll(".menu a").forEach(a=>a.classList.toggle("on", (a.dataset.r||"")===p.split("/")[0]));
  window.scrollTo({top:0, behavior:"instant"});
  startCountdown();
  document.title = "خميسنا أحلى" + (p? " · " + (document.querySelector(".ptitle")||{textContent:""}).textContent : "");
}
async function loadResp(){ try{ RESP = await STORE.responses(); }catch(e){ RESP=[]; toast(e.message,false);} if(path()==="team") render(); }
let cdTimer=null; let zoom=1;
function startCountdown(){
  clearInterval(cdTimer); const box=document.querySelector(".count"); if(!box) return;
  const target = new Date(box.dataset.iso+"T07:00:00+03:00");
  const tick=()=>{ let d=Math.max(0,target-new Date()); const D=Math.floor(d/864e5), H=Math.floor(d%864e5/36e5), M=Math.floor(d%36e5/6e4);
    box.querySelector("[data-d]").textContent=AR(D); box.querySelector("[data-h]").textContent=AR(H); box.querySelector("[data-m]").textContent=AR(M);
    if(d===0) box.querySelector(".cdown").innerHTML='<div class="live">🎉 الفعالية اليوم!</div>'; };
  tick(); cdTimer=setInterval(tick,30000);
}

/* ================= الأحداث ================= */
document.addEventListener("click", async ev=>{
  if(ev.target.matches("[data-modal]")){ ev.target.remove(); return; }
  const el = ev.target.closest("[data-act]"); if(!el) return;
  const act = el.dataset.act;
  if(act==="pick-ev"){ setEvent(el.dataset.id); render(); }
  else if(act==="pick-ev-go"){ setEvent(el.dataset.id); }
  else if(act==="code-change"){ KV.del("kh2_code"); if(path()!=="s") location.hash="#/s"; else render(); }
  else if(act==="menu"){ document.body.classList.toggle("menu-open"); }
  else if(act==="dark"){ document.body.classList.toggle("dark"); try{KV.set("kh2_dark",document.body.classList.contains("dark")?"1":"")}catch(e){} }
  else if(act==="hc"){ document.body.classList.toggle("hc"); }
  else if(act==="zin"||act==="zout"){ zoom=Math.min(1.4,Math.max(.85,zoom+(act==="zin"?.1:-.1))); document.documentElement.style.fontSize=(16*zoom)+"px"; document.getElementById("app").style.zoom=zoom; }
  else if(act==="help-open"){ document.body.insertAdjacentHTML("beforeend", helpModal()); }
  else if(act==="help-close" || (act==="help-bg")){ document.querySelector("[data-modal]")?.remove(); }
  else if(act==="tab"){ teamTab=el.dataset.tab; history.replaceState(null,"","#/team?tab="+teamTab); if(teamTab==="extra"||teamTab==="after"){ RESP=null; loadResp(); } render(); }
  else if(act==="logout"){ STORE.logout(); RESP=null; render(); }
  else if(act==="add-ev"){ const id="ev-"+Date.now(); S.events.push({id,track:"skills",title:"فعالية جديدة",date:"",iso:new Date().toISOString().slice(0,10),stage:"المتوسطة والثانوية",status:"مسودة",goal:"",summary:"",tasks:{students:"",teachers:"",parents:""},talents:[]}); S.links[id]={}; await persist("أُضيفت مسودة فعالية"); }
  else if(act==="classify"){ S.classify=S.classify||{}; S.classify[el.dataset.key]=el.dataset.v; await persist(null); }
  else if(act==="publish"){ const resp=await STORE.responses(); const A=analyze(resp); S.published={at:new Date().toISOString(), events:A, overall:overall(A)};
    Object.values(S.published.events).forEach(x=>delete x.improve); await persist("نُشرت النتائج المجمّعة"); }
  else if(act==="csv-template"){ ev.preventDefault(); download("khamisna-template.csv","event_id,kind,code,score\nculture-1448,pre,٢م-٠٥-فا,60\nculture-1448,post,٢م-٠٥-فا,80\n"); }
  else if(act==="exp-csv"){ const r=await STORE.responses(); const rows=[["event_id","kind","ts","code","class","score","sat","deep","spec","improve","role","idea","obs","support"]];
    r.forEach(x=>{const p=x.payload; const sc=p.score!=null?p.score:(x.kind==="pre"||x.kind==="post"?score(x.kind,x.event_id,p):""); rows.push([x.event_id,x.kind,x.ts,p.code||"",p.cls||"",sc==null?"":sc,p.sat||"",p.deep||"",p.spec||"",p.improve||"",p.role||"",p.idea||"",(p.obs||[]).join("؛"),p.support||""]);});
    download("khamisna-responses.csv","﻿"+rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")).join("\n")); }
  else if(act==="exp-json"){ const r=await STORE.responses(); download("khamisna-backup.json", JSON.stringify({state:S,responses:r},null,1)); }
  else if(act==="print-report"){ printReport(); }
});
document.addEventListener("input", ev=>{
  const el=ev.target;
  if(el.dataset.act==="help-search"){ const q=el.value.trim(); document.querySelectorAll(".hq").forEach(d=>{ const m=!q||d.textContent.includes(q); d.style.display=m?"":"none"; if(q&&m) d.open=true; }); }
  const f=el.closest("form"); if(f && f.querySelector("[data-codeprev]")) f.querySelector("[data-codeprev]").textContent = readCode(f)||"—";
  if(f && f.classList.contains("test")){ const n=[...f.querySelectorAll(".q")].filter(q=>q.querySelector("input:checked")||(q.querySelector("textarea")&&q.querySelector("textarea").value)).length; const tot=f.querySelectorAll(".q").length; f.querySelector("[data-bar]").style.width=(n/tot*100)+"%"; }
});
document.addEventListener("change", ev=>{
  const el=ev.target;
  if(el.dataset.act==="stage-change"){ const sel=el.closest("form").querySelector("[name=cls]"); sel.innerHTML='<option value="">اختاري</option>'+(CONFIG.classes[el.value]||[]).map(c=>`<option>${c}</option>`).join(""); }
  if(el.dataset.act==="csv"){ const file=el.files[0]; if(!file) return; file.text().then(async txt=>{
    const lines=txt.replace(/^﻿/,"").split(/\r?\n/).filter(Boolean); const head=lines.shift().split(",").map(s=>s.trim());
    const ix=k=>head.indexOf(k); if(ix("event_id")<0||ix("kind")<0||ix("code")<0||ix("score")<0) return toast("الأعمدة المطلوبة: event_id, kind, code, score",false);
    const rows=lines.map(l=>l.split(",")).filter(c=>c.length>=4).map(c=>({kind:c[ix("kind")].trim(),event_id:c[ix("event_id")].trim(),payload:{code:c[ix("code")].trim(),score:+c[ix("score")],imported:true},ts:new Date().toISOString()})).filter(r=>(r.kind==="pre"||r.kind==="post")&&!isNaN(r.payload.score));
    await STORE.addImported(rows); toast("استُورد "+AR(rows.length)+" صفًا"); RESP=null; loadResp(); }); }
});
document.addEventListener("submit", async ev=>{
  const f=ev.target; const kind=f.dataset.form; if(!kind) return; ev.preventDefault();
  const fd=new FormData(f); const eid=currentEventId();
  if(kind!=="setcode" && f.querySelector(".codebox") && readCode(f)) rememberCode(readCode(f));
  const btn=f.querySelector("button:not([type=button])"); if(btn) btn.disabled=true;
  try{
    if(kind==="gate"){ const g=f.dataset.g; const ok=await STORE.checkAccess(g,(fd.get("code")||"").trim(),(S.access||{})[g]); if(!ok) throw new Error("الرمز غير صحيح"); KV.set("kh2_unlock_"+g,accessVer(g)); toast("أهلًا بكِ ✦"); render(); return; }
    if(kind==="setcode"){ const c=readCode(f); if(!c) throw new Error("أكملي بياناتك"); rememberCode(c); toast("حُفظت بياناتك ✦ اختاري الخميس"); render(); setTimeout(()=>document.querySelector(".evlist")?.scrollIntoView({behavior:"smooth"}),300); return; }
    if(kind==="pre"||kind==="post"){
      const code=readCode(f); if(!code) throw new Error("سجّلي بياناتك أولًا");
      if(KV.get(doneKey(kind,eid))) throw new Error("أرسلتِ هذا الاختبار من قبل");
      const p={code}; QUESTIONS[eid][kind].forEach((q,i)=>p["q"+i]=fd.get("q"+i));
      if(kind==="post"){ p.deep=fd.get("deep"); p.spec=fd.get("spec"); p.improve=fd.get("improve"); p.sat=fd.get("sat"); }
      const sc=score(kind,eid,p); await STORE.submit(kind,eid,p);
      KV.set(doneKey(kind,eid), kind==="post" ? AR(Math.round(sc/20))+" من ٥" : "1");
      toast(kind==="pre"?"وصلت إجاباتك 🎉 الخطوة التالية: سجّلي دورك":"أحسنتِ! وصل رأيك 🎉"); confetti(); render(); return;
    }
    if(kind==="role"||kind==="idea"){ const code=readCode(f); if(!code) throw new Error("سجّلي بياناتك أولًا"); if(kind==="role") KV.set(doneKey("role",eid), fd.get("role"));
      await STORE.submit(kind,eid,{code, role:fd.get("role"), idea:fd.get("idea")}); toast(kind==="role"?"سُجّل دورك 👑":"وصلت فكرتك 💡"); confetti(); render(); }
    else if(kind==="teacher"){ const Q=QUESTIONS[eid]||{teacherInd:["المشاركة","التعاون","التواصل","الاحترام"]}; const p={cls:fd.get("cls"),teacher:fd.get("teacher"),example:fd.get("example"),improve:fd.get("improve"),sat:fd.get("sat"),talents:fd.getAll("talents"),talentCount:fd.get("talentCount")}; Q.teacherInd.forEach((x,i)=>p["ind"+i]=fd.get("ind"+i));
      const w=await STORE.submit("teacher",eid,p); toast("شكرًا لكِ! وصلت بطاقة "+p.cls+(w==="local"?" (على هذا الجهاز)":"")); f.reset(); }
    else if(kind==="parent"){ const w=await STORE.submit("parent",eid,{cls:fd.get("cls"),obs:fd.getAll("obs"),support:fd.get("support"),sat:fd.get("sat"),note:fd.get("note")}); toast("شكرًا لمشاركتكم 🌷"+(w==="local"?" (على هذا الجهاز)":"")); f.reset(); }
    else if(kind==="badges"){ const code=readCode(f); if(!code) throw new Error("أكملي رمزك"); const b=S.badges[code]||[]; const box=document.querySelector("[data-badges]");
      box.innerHTML = b.length? `<div class="mybadges">${b.map(k=>{const x=BADGES.find(y=>y.k===k)||{e:"🏅"};return `<div class="mb"><span>${x.e}</span><b>${k}</b></div>`}).join("")}</div>` : `<p class="pending">لا شارات بعد لهذا الرمز — شاركي في الخميس القادم لتحصلي على أولى شاراتك ✨</p>`; if(b.length) confetti(); }
    else if(kind==="login"){ const ok=await STORE.login(fd.get("pin")); if(!ok) throw new Error("الرقم السري غير صحيح"); teamTab="events"; render(); }
    else if(kind==="hilite"){ S.highlights={idea:(fd.get("idea")||"").trim(),talent:(fd.get("talent")||"").trim()}; await persist("حُفظت لوحة الطالبات"); }
    else if(kind==="access"){ S.access=S.access||{}; S.accessVer=S.accessVer||{}; let n=0; for(const g of ["t","p"]){ const v=(fd.get(g)||"").trim(); if(v){ if(v.length<4) throw new Error("الرمز ٤ أرقام على الأقل"); const r=await STORE.setAccess(g,v); S.access[g]= r==="server" ? "" : r; S.accessVer[g]=(S.accessVer[g]||0)+1; KV.set("kh2_unlock_"+g,accessVer(g)); n++; } } if(!n) throw new Error("اكتبي رمزًا جديدًا"); await persist("حُفظت الرموز"); }
    else if(kind==="pin"){ await STORE.changePin(fd.get("pin")); toast("تغيّر الرقم السري"); f.reset(); }
    else if(kind==="ev"){ const e=S.events[+f.dataset.i]; ["title","track","status","date","iso","stage","goal"].forEach(k=>e[k]=fd.get(k)); S.links[e.id]=Object.assign(S.links[e.id]||{},{padlet:(fd.get("padlet")||"").trim()}); e.tasks={students:fd.get("t_students"),teachers:fd.get("t_teachers"),parents:fd.get("t_parents")}; await persist("حُفظت الفعالية"); }
    else if(kind==="rec"){ const o={}; for(const [k,v] of fd) o[k]=v.trim(); const ev=evById(f.dataset.id); if(ev) ev.summary=o.summary; delete o.summary; S.records[f.dataset.id]=o; await persist("حُفظت نتائج التنفيذ"); }
    else if(kind==="points"){ const P=POINTS.find(p=>p.k===fd.get("reason")); const pts=P.p*(+fd.get("count")||1); const c=fd.get("cls"); S.board[c]=(S.board[c]||0)+pts; S.boardLog.push({cls:c,pts,t:P.t,at:new Date().toISOString()}); await persist("رُصدت "+AR(pts)+" نقاط لـ "+c); }
    else if(kind==="badge-give"){ const c=fd.get("code").trim(), b=fd.get("badge"); S.badges[c]=S.badges[c]||[]; if(!S.badges[c].includes(b)) S.badges[c].push(b); await persist("مُنحت شارة "+b); }
    else if(kind==="impact"){ INDICATORS.forEach(i=>{ if(fd.has(i.id+"_value")){ S.impact[i.id]={value:fd.get(i.id+"_value").trim(),baseline:(fd.get(i.id+"_baseline")||"").trim(),n:"",period:""}; } }); await persist("حُفظت المؤشرات"); }
  }catch(e){ toast(e.message,false); }
  finally{ if(btn) btn.disabled=false; }
});
async function persist(msg){ try{ const open=[...document.querySelectorAll("details[open]")].map(d=>[...document.querySelectorAll("details")].indexOf(d)); const y=window.scrollY; await STORE.saveState(S); if(msg) toast(msg); render(); const ds=document.querySelectorAll("details"); open.forEach(i=>ds[i]&&(ds[i].open=true)); window.scrollTo(0,y); }catch(e){ toast(e.message,false); } }
function download(name, text){ const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"})); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),2000); }
function printReport(){
  const w=window.open("","_blank"); if(!w) return toast("اسمحي بالنوافذ المنبثقة",false);
  const html = `<html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>تقرير خميسنا أحلى</title><style>body{font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;padding:24px;color:#1e1b4b}h1{color:#6d28d9}.box{border:1px solid #ddd;border-radius:10px;padding:12px;margin:10px 0;break-inside:avoid}.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.kpis div{border:1px solid #eee;padding:6px;border-radius:8px}.pending{color:#92400e}small{display:block;color:#666}a{display:none}.ind{border:1px solid #eee;border-radius:8px;padding:8px;margin:6px 0;break-inside:avoid}</style></head><body><h1>تقرير مبادرة خميسنا أحلى</h1><p>${esc(CONFIG.school)} · ${esc(CONFIG.term)}</p>${S.events.filter(e=>e.status==="منفّذة").map(e=>eventResultsBlock(e.id)).join("")}${vImpact()}</body></html>`;
  w.document.write(html); w.document.close(); setTimeout(()=>w.print(),600);
}
function confetti(){
  const box=document.createElement("div"); box.className="confetti";
  const cs=["#f97316","#ec4899","#7c3aed","#14b8a6","#facc15"];
  for(let i=0;i<40;i++){ const s=document.createElement("i"); s.style.left=Math.random()*100+"%"; s.style.background=cs[i%5]; s.style.animationDelay=(Math.random()*.4)+"s"; s.style.transform=`rotate(${Math.random()*360}deg)`; box.appendChild(s); }
  document.body.appendChild(box); setTimeout(()=>box.remove(),2200);
}

/* ================= التشغيل ================= */
(async function init(){
  S = await STORE.loadState();
  const m=$("#mode"); if(m){ m.textContent = STORE.shared ? "🟢 الحفظ المشترك مفعّل" : "🟡 وضع المعاينة: الحفظ على هذا الجهاز"; }
  window.addEventListener("hashchange", ()=>{ document.body.classList.remove("menu-open"); render(); });
  try{ if(KV.get("kh2_dark")) document.body.classList.add("dark"); }catch(e){}
  render();
})();
})();
