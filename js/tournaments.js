(function(){
  const KEY='gz_tournaments',REG_KEY='gz_registrations';
  const seed=[
    {id:'t-001',name:'Neon Night Clash',game:'Valorant',type:'Paid',date:'2026-10-08',time:'19:00',prize:'₹10,000',slots:100,description:'A fast-paced tactical tournament for student squads.',createdAt:'2026-09-20'},
    {id:'t-002',name:'Firestorm Solo Cup',game:'Free Fire',type:'Free',date:'2026-10-11',time:'18:30',prize:'₹5,000',slots:80,description:'Quick rounds, smart rotations and a final-zone finish.',createdAt:'2026-09-22'},
    {id:'t-003',name:'COD Campus League',game:'Call of Duty',type:'Paid',date:'2026-10-15',time:'20:00',prize:'₹15,000',slots:64,description:'Campus teams battle for the GameZone season title.',createdAt:'2026-09-24'},
    {id:'t-004',name:'Fortnite Creative Rush',game:'Fortnite',type:'Free',date:'2026-10-18',time:'17:00',prize:'₹3,000',slots:120,description:'Creative builds, rapid fights and a student-only lobby.',createdAt:'2026-09-26'},
    {id:'t-005',name:'Weekend Warzone',game:'Call of Duty',type:'Free',date:'2026-10-23',time:'19:30',prize:'₹4,000',slots:100,description:'Weekend community tournament open to all registered players.',createdAt:'2026-09-27'},
    {id:'t-006',name:'Valorant Zero Hour',game:'Valorant',type:'Paid',date:'2026-10-27',time:'20:30',prize:'₹20,000',slots:64,description:'High-intensity student esports with a serious bracket.',createdAt:'2026-09-28'}
  ];
  function get(){let data=JSON.parse(localStorage.getItem(KEY)||'null');if(!data){data=seed;localStorage.setItem(KEY,JSON.stringify(data))}return data}
  function save(data){localStorage.setItem(KEY,JSON.stringify(data))}
  function getRegs(){return JSON.parse(localStorage.getItem(REG_KEY)||'[]')}
  function saveRegs(data){localStorage.setItem(REG_KEY,JSON.stringify(data))}
  function formatDate(date){return new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(date+'T00:00:00'))}
  function formatTime(time){const [h,m]=time.split(':').map(Number);const d=new Date();d.setHours(h,m);return d.toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'})}
  function registrationCount(id){return getRegs().filter(r=>r.tournamentId===id).length}
  function isRegistered(id,email){return getRegs().some(r=>r.tournamentId===id&&r.userEmail===email)}
  function register(id,user){const t=get().find(x=>x.id===id);if(!t)return{ok:false,msg:'Tournament not found.'};if(isRegistered(id,user.email))return{ok:false,msg:'You are already registered.'};if(registrationCount(id)>=Number(t.slots))return{ok:false,msg:'This tournament is full.'};const regs=getRegs();regs.push({id:'r-'+Date.now(),tournamentId:id,userEmail:user.email,userName:user.name,registeredAt:new Date().toISOString()});saveRegs(regs);return{ok:true,msg:'Registration confirmed.'}}
  function unregister(id,email){saveRegs(getRegs().filter(r=>!(r.tournamentId===id&&r.userEmail===email)))}
  function card(t,user){const count=registrationCount(t.id),joined=user&&isRegistered(t.id,user.email);return `<article class="tournament-card"><div class="tournament-banner"><span class="game-label">${t.game.toUpperCase()}</span><span class="type-chip ${t.type==='Free'?'type-free':'type-paid'}">${t.type.toUpperCase()}</span></div><div class="tournament-body"><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.description||'Open tournament for registered GameZone players.')}</p><div class="tournament-meta"><div><small>Date</small><strong>${formatDate(t.date)}</strong></div><div><small>Time</small><strong>${formatTime(t.time)}</strong></div><div><small>Prize</small><strong>${escapeHtml(t.prize)}</strong></div><div><small>Slots</small><strong>${count}/${t.slots}</strong></div></div><div class="card-actions"><a class="btn btn-ghost" href="details.html?id=${encodeURIComponent(t.id)}">Details</a>${user?`<button class="btn ${joined?'btn-ghost':'btn-primary'} register-btn" data-id="${t.id}">${joined?'Registered':'Register'}</button>`:''}</div></div></article>`}
  function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function addDefaultData(){get()}
  document.addEventListener('click',e=>{const btn=e.target.closest('.register-btn');if(!btn||btn.disabled)return;const user=window.GameAuth?.getSession();if(!user){window.location.href='../login.html';return}if(btn.textContent.trim()==='Registered')return;const result=register(btn.dataset.id,user);window.GameAuth.toast(result.msg,result.ok?'success':'error');if(result.ok){btn.textContent='Registered';btn.classList.remove('btn-primary');btn.classList.add('btn-ghost');}});
  window.GameTournaments={get,save,getRegs,saveRegs,formatDate,formatTime,registrationCount,isRegistered,register,unregister,card,escapeHtml,KEY,REG_KEY,addDefaultData};
  addDefaultData();
})();
