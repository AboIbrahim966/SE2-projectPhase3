// api-bridge.js
(function(){
  const BASE = window.API_BASE || 'http://localhost/backend-php-mysql-scaffold/';
  async function api(path, method='GET', body){
    const opt = { method, headers:{} };
    if (body){ opt.headers['Content-Type']='application/json'; opt.body = JSON.stringify(body); }
    const res = await fetch(BASE + path, opt);
    return res.json();
  }
  window.API = {
    login: (email, password)=>api('api_login.php','POST',{email,password}),
    register: (name, email, password)=>api('api_register.php','POST',{name,email,password}),
    listEvents: ()=>api('api_events_list.php'),
    book: (user_id, event_id, qty=1)=>api('api_book.php','POST',{user_id,event_id,qty})
  };
  window.Session = {
    get(){ try{return JSON.parse(localStorage.getItem('user')||'null');}catch{return null} },
    set(u){ localStorage.setItem('user', JSON.stringify(u)); },
    clear(){ localStorage.removeItem('user'); }
  };
  window.fmtDate = function(dt){ try{return new Date(dt).toLocaleString()}catch{return dt} };
})();