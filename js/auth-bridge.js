// auth-bridge.js
(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const loginForm = document.querySelector('form[data-auth="login"]')
      || document.querySelector('form[action*="login" i]')
      || document.querySelector('form#login, form.login, form[name="login"]')
      || document.querySelector('form');
    if (loginForm){
      const email = loginForm.querySelector('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="example.com" i]');
      const pass  = loginForm.querySelector('input[type="password"], input[name="password"]');
      if (email && pass){
        loginForm.addEventListener('submit', async (e)=>{
          e.preventDefault();
          const btn = loginForm.querySelector('button[type="submit"], input[type="submit"]');
          const old = btn && (btn.innerText || btn.value);
          if (btn){ btn.disabled=true; if(btn.innerText) btn.innerText='...'; }
          try {
            const data = await API.login(email.value.trim(), pass.value);
            if (data.ok){ Session.set(data.user); location.href='index.html'; }
            else alert('Login failed: ' + (data.error||''));
          } catch(e2){ alert('Cannot reach server'); }
          finally { if (btn){ btn.disabled=false; if(btn.innerText!==undefined) btn.innerText=old; } }
        });
      }
    }

    const regForm = document.querySelector('form[data-auth="register"]')
      || document.querySelector('form[action*="register" i]')
      || document.querySelector('form#register, form.register, form[name="register"]');
    if (regForm){
      const nameI = regForm.querySelector('input[name="name"], input[placeholder*="name" i], input[placeholder*="الاسم" i]');
      const emailI= regForm.querySelector('input[type="email"], input[name="email"]');
      const passI = regForm.querySelector('input[type="password"], input[name="password"]');
      if (nameI && emailI && passI){
        regForm.addEventListener('submit', async (e)=>{
          e.preventDefault();
          const data = await API.register(nameI.value.trim(), emailI.value.trim(), passI.value);
          alert(data.ok ? 'Registered successfully — please log in' : ('Register failed: ' + (data.error||'')));
        });
      }
    }
  });
})();