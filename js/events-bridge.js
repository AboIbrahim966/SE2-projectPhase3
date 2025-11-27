// events-bridge.js
(function(){
  document.addEventListener('DOMContentLoaded', async ()=>{
    const box = document.querySelector('#events, [data-events]');
    if (!box) return;
    box.innerHTML = 'Loading...';
    try {
      const data = await API.listEvents();
      const items = (data && data.events) || [];
      if (!items.length){ box.innerHTML = '<p>No events yet.</p>'; return; }
      box.innerHTML = items.map(e => `
        <div class="event-card">
          <h3>${e.title}</h3>
          <p>${e.location} — ${fmtDate(e.event_date)}</p>
          <p>Price: ${e.price}</p>
          <button data-book="${e.id}">Book</button>
        </div>
      `).join('');
      box.addEventListener('click', async (ev)=>{
        const id = ev.target && ev.target.getAttribute('data-book');
        if (!id) return;
        const u = Session.get(); if (!u){ alert('Please login first'); location.href='login.html'; return; }
        const r = await API.book(u.id, Number(id), 1);
        alert(r.ok ? ('Booked! ID: '+r.booking_id) : ('Booking failed: ' + (r.error||'')));
      });
    } catch(e){ box.innerHTML = '<p style="color:red">Server error.</p>'; }
  });
})();