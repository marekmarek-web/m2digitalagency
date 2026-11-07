/* Poradci: výběr typu podnikání zvýrazní jen relevantní termíny v ročním kalendáři. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pick = $('[data-pick]'), cal = $('[data-cal]');
  if (pick && cal) {
    const bs = $$('button', pick), cnt = $('[data-cnt]', cal), all = $$('li', cal);
    const set = (k) => { bs.forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === k)); let n = 0; all.forEach((li) => { const on = li.dataset.w.includes(k); li.classList.toggle('off', !on); if (on) n++; }); if (window.__wheel) window.__wheel(); cnt.textContent = n + (n === 1 ? ' termín' : n < 5 ? ' termíny' : ' termínů') + ' v roce'; };
    bs.forEach((b) => b.addEventListener('click', () => set(b.dataset.k))); set('o');
  }
  const wheel = $('[data-wheel]');
  if (wheel) {
    const NS = 'http://www.w3.org/2000/svg', C = 280, now = new Date(), y = now.getFullYear(), start = new Date(y, 0, 1), days = (new Date(y + 1, 0, 1) - start) / 864e5;
    const ang = (dt) => ((dt - start) / 864e5 / days) * 360 - 90, pt = (a, r) => [C + r * Math.cos(a * Math.PI / 180), C + r * Math.sin(a * Math.PI / 180)];
    const mk = (n, at, p) => { const e = document.createElementNS(NS, n); for (const k in at) e.setAttribute(k, at[k]); (p || null) && p.appendChild(e); return e; };
    const tk = $('[data-ticks]', wheel), dg = $('[data-dots]', wheel);
    ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'].forEach((m, i) => { const a = ang(new Date(y, i, 1)), [x1, y1] = pt(a, 120), [x2, y2] = pt(a, 270); mk('line', { x1, y1, x2, y2, class: 'w-t' }, tk); const am = ang(new Date(y, i, 16)), [tx, ty] = pt(am, 236); const t = mk('text', { x: tx, y: ty + 4, class: 'w-m' }, tk); t.textContent = m.toUpperCase(); });
    const dots = $$('[data-cal] li').map((li) => { const dt = new Date(y, +li.dataset.m - 1, +li.dataset.d), [cx, cy] = pt(ang(dt), 176); const c = mk('circle', { cx, cy, r: 9, class: 'w-dot' }, dg); return { li, dt, c }; });
    const nowA = ang(now); $('[data-now]', wheel).style.transform = 'rotate(' + (nowA + 90) + 'deg)';
    const mo = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
    window.__wheel = () => { const on = dots.filter((d) => !d.li.classList.contains('off')); dots.forEach((d) => { d.c.classList.toggle('off', d.li.classList.contains('off')); d.c.classList.remove('nx'); }); let nx = on.filter((d) => d.dt >= new Date(y, now.getMonth(), now.getDate())).sort((a, b) => a.dt - b.dt)[0]; if (!nx) nx = on[0]; if (!nx) return; nx.c.classList.add('nx'); const dd = Math.round((nx.dt - new Date(y, now.getMonth(), now.getDate())) / 864e5); $('[data-nx-d]', wheel).textContent = nx.dt.getDate() + '. ' + mo[nx.dt.getMonth()]; $('[data-nx-t]', wheel).textContent = $('span', nx.li).textContent; $('[data-nx-in]', wheel).textContent = dd < 0 ? 'příští rok' : dd === 0 ? 'dnes' : 'za ' + dd + ' dní'; };
    window.__wheel();
  }
  const ck = $('[data-ck]');
  if (ck) { const bx = $$('input', ck); bx.forEach((b) => b.addEventListener('change', () => { const n = bx.filter((x) => x.checked).length; $('[data-pg]', ck).textContent = n + ' z ' + bx.length; $('[data-bar]', ck).style.width = n / bx.length * 100 + '%'; })); }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 }) : null;
  $$('.never li,.steps li,.band,.faq details,.first > div').forEach((e) => { if (io) { e.classList.add('rv'); io.observe(e); } });
  const form = $('[data-form]');
  if (form) form.addEventListener('submit', (e) => { e.preventDefault(); let first; $$('[required]', form).forEach((i) => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.setAttribute('aria-invalid', bad); if (bad && !first) first = i; }); $('.bad', form).hidden = !first; $('.ok', form).hidden = !!first; if (first) first.focus(); });
})();
