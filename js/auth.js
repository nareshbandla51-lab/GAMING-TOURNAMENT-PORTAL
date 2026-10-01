(function(){
  const USERS_KEY='gz_users'; const SESSION_KEY='gz_session';
  const seedAdmin={id:'admin-001',name:'GameZone Admin',email:'admin@gamezone.com',password:'admin123',role:'admin',status:'active',createdAt:'2026-09-01T09:00:00'};
  function getUsers(){return JSON.parse(localStorage.getItem(USERS_KEY)||'[]')}
  function saveUsers(users){localStorage.setItem(USERS_KEY,JSON.stringify(users))}
  function ensureAdmin(){let users=getUsers(); if(!users.some(u=>u.email===seedAdmin.email)){users.push(seedAdmin);saveUsers(users)}}
  function getSession(){return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}
  function setSession(user){localStorage.setItem(SESSION_KEY,JSON.stringify(user))}
  function clearSession(){localStorage.removeItem(SESSION_KEY)}
  function redirectByRole(user){window.location.href=user.role==='admin'?'admin/dashboard.html':'user/dashboard.html'}
  function toast(message,type='success'){const old=document.querySelector('.toast');if(old)old.remove();const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;document.body.appendChild(el);setTimeout(()=>el.remove(),2800)}
  function requireAuth(role){const session=getSession(); if(!session){window.location.href='../login.html';return null} if(role&&session.role!==role){window.location.href=session.role==='admin'?'../admin/dashboard.html':'../user/dashboard.html';return null} return session}
  function setupPasswordToggles(){document.querySelectorAll('.show-pass').forEach(btn=>btn.addEventListener('click',()=>{const input=document.getElementById(btn.dataset.target);input.type=input.type==='password'?'text':'password';btn.textContent=input.type==='password'?'Show':'Hide'}))}
  ensureAdmin(); setupPasswordToggles();
  const signup=document.getElementById('signupForm');
  if(signup){signup.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('signupName').value.trim(),email=document.getElementById('signupEmail').value.trim().toLowerCase(),password=document.getElementById('signupPassword').value,confirm=document.getElementById('signupConfirm').value,msg=document.getElementById('signupMessage');if(password!==confirm){msg.className='form-message error';msg.textContent='Passwords do not match.';return}let users=getUsers();if(users.some(u=>u.email===email)){msg.className='form-message error';msg.textContent='An account with this email already exists.';return}const user={id:'user-'+Date.now(),name,email,password,role:'user',status:'active',createdAt:new Date().toISOString()};users.push(user);saveUsers(users);setSession({id:user.id,name:user.name,email:user.email,role:user.role,status:user.status,createdAt:user.createdAt});msg.className='form-message success';msg.textContent='Account created. Entering the arena…';setTimeout(()=>window.location.href='user/dashboard.html',500)})}
  const login=document.getElementById('loginForm');
  if(login){login.addEventListener('submit',e=>{e.preventDefault();const email=document.getElementById('loginEmail').value.trim().toLowerCase(),password=document.getElementById('loginPassword').value,msg=document.getElementById('loginMessage');const user=getUsers().find(u=>u.email===email&&u.password===password);if(!user){msg.className='form-message error';msg.textContent='Invalid email or password.';return}if(user.status==='banned'){msg.className='form-message error';msg.textContent='This account is currently banned.';return}setSession({id:user.id,name:user.name,email:user.email,role:user.role,status:user.status,createdAt:user.createdAt});msg.className='form-message success';msg.textContent='Login successful. Redirecting…';setTimeout(()=>redirectByRole(user),350)})}
  const logout=document.getElementById('logoutBtn'); if(logout)logout.addEventListener('click',()=>{clearSession();window.location.href=location.pathname.includes('/admin/')?'../login.html':'../login.html'});
  window.GameAuth={getUsers,saveUsers,getSession,setSession,clearSession,redirectByRole,toast,requireAuth,ensureAdmin,USERS_KEY,SESSION_KEY};
})();
