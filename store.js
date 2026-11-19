/* ============ طبقة الحفظ ============
   وضعان:
   - مشترك: عند تعبئة supabaseUrl و supabaseAnonKey في CONFIG. الردود تُرسل للخادم، والرقم السري يُتحقق منه على الخادم.
   - معاينة: بدونهما. كل شيء يُحفظ على هذا الجهاز فقط (للتجربة).
*/
(function(){
  const C = window.CONFIG;
  const shared = !!(C.supabaseUrl && C.supabaseAnonKey);
  const LS_STATE = "kh2_state", LS_RESP = "kh2_resp", LS_PIN = "kh2_pin_hash";
  const PREVIEW_PIN = "1448"; // معاينة فقط — في الوضع المشترك الرقم محفوظ في الخادم ولا يظهر هنا

  function defaultState(){
    return {
      events: JSON.parse(JSON.stringify(window.SEED_EVENTS)),
      links: {
        "culture-1448":  {pre:"",post:"",teacher:"",parent:"",padlet:"",poster:"",madrasati:""},
        "challenge-1448":{pre:"",post:"",teacher:"",parent:"",padlet:"",poster:"",madrasati:""}
      },
      general: {padlet:"", termPre:"", termPost:"", excel:""},
      records: {},     // eventId -> {attendance, target, participants, leaders, talents, source, evidence, improvement, notes}
      board: {},       // className -> points
      boardLog: [],
      badges: {},      // code -> [badge]
      ideas: [],       // أفكار مقبولة للعرض العام {text, month, status}
      impact: {},      // indicatorId -> {value, n, period, baseline, note}
      access: {t:"2ace3763af339e1b735f0b3cccd9c31a27473ae1a2d80a4e2a0b07ab220e73f9", p:"0c86f2dfd04b5d52de85408b658cd99e053d9010b38c56da20673c9a891e9746"}, // رمزا دخول المعلمات وأولياء الأمور (مشفّران)
      published: null, // آخر نتائج مجمّعة منشورة من الفريق
      updated: null
    };
  }
  function mergeState(s){
    const d = defaultState();
    if(!s) return d;
    for(const k in d) if(s[k]===undefined) s[k]=d[k];
    return s;
  }
  async function normDigits(t){ return String(t).trim().replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d)); }
  async function sha(t){
    t=String(t).trim().replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
  }
  async function sb(path, opt={}){
    const r = await fetch(C.supabaseUrl.replace(/\/$/,"")+"/rest/v1/"+path, {
      method: opt.method||"GET",
      headers: {"apikey":C.supabaseAnonKey,"Authorization":"Bearer "+C.supabaseAnonKey,"Content-Type":"application/json","Prefer":"return=minimal"},
      body: opt.body?JSON.stringify(opt.body):undefined
    });
    if(!r.ok) throw new Error("تعذّر الاتصال بالخادم ("+r.status+")");
    const t = await r.text(); return t?JSON.parse(t):null;
  }

  let adminPin = null;

  window.STORE = {
    sha,
    shared,
    modeLabel: shared ? "الحفظ المشترك مفعّل" : "وضع المعاينة: الحفظ على هذا الجهاز فقط",
    async loadState(){
      if(shared){
        try{ const r = await sb("public_state?id=eq.1&select=data"); return mergeState(r&&r[0]?r[0].data:null); }
        catch(e){ console.warn(e); return defaultState(); }
      }
      try{ return mergeState(JSON.parse(KV.get(LS_STATE))); }catch(e){ return defaultState(); }
    },
    async submit(kind, eventId, payload){
      const row = {kind, event_id:eventId, payload, ts:new Date().toISOString()};
      if(shared){ await sb("responses",{method:"POST",body:row}); return "server"; }
      let a=[]; try{a=JSON.parse(KV.get(LS_RESP))||[]}catch(e){}
      a.push(row); KV.set(LS_RESP, JSON.stringify(a)); return "local";
    },
    async login(pin){
      if(shared){
        pin=await normDigits(pin); const ok = await sb("rpc/admin_login",{method:"POST",body:{p_pin:pin}});
        if(ok===true){ adminPin=pin; return true; } return false;
      }
      const h = await sha(pin);
      const stored = KV.get(LS_PIN) || await sha(PREVIEW_PIN);
      if(h===stored){ adminPin=pin; return true; } return false;
    },
    isAdmin(){ return !!adminPin; },
    logout(){ adminPin=null; },
    async changePin(newPin){
      if(!adminPin) throw new Error("غير مصرّح");
      if(shared){ newPin=await normDigits(newPin); await sb("rpc/admin_change_pin",{method:"POST",body:{p_pin:adminPin,p_new:newPin}}); }
      else KV.set(LS_PIN, await sha(newPin));
      adminPin=newPin;
    },
    async saveState(s){
      if(!adminPin) throw new Error("غير مصرّح");
      s.updated = new Date().toISOString();
      if(shared){ await sb("rpc/admin_save_state",{method:"POST",body:{p_pin:adminPin,p_data:s}}); return; }
      KV.set(LS_STATE, JSON.stringify(s));
    },
    async responses(){
      if(!adminPin) throw new Error("غير مصرّح");
      if(shared){ return await sb("rpc/admin_responses",{method:"POST",body:{p_pin:adminPin}}) || []; }
      try{ return JSON.parse(KV.get(LS_RESP))||[]; }catch(e){ return []; }
    },
    async checkAccess(g, code, localHash){
      if(shared){ return (await sb("rpc/check_access",{method:"POST",body:{p_group:g,p_code:await normDigits(code)}}))===true; }
      return (await sha(code))===localHash;
    },
    async setAccess(g, code){
      if(!adminPin) throw new Error("غير مصرّح");
      if(shared){ await sb("rpc/admin_set_access",{method:"POST",body:{p_pin:adminPin,p_group:g,p_code:await normDigits(code)}}); return "server"; }
      return await sha(code);
    },
    async addImported(rows){
      if(!adminPin) throw new Error("غير مصرّح");
      if(shared){ await sb("rpc/admin_import",{method:"POST",body:{p_pin:adminPin,p_rows:rows}}); return; }
      let a=[]; try{a=JSON.parse(KV.get(LS_RESP))||[]}catch(e){}
      KV.set(LS_RESP, JSON.stringify(a.concat(rows)));
    }
  };
})();
