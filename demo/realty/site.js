/* M² Development: scroll staví dům. Každá vrstva výkresu má svoji fázi, na konci se setmí a okna se rozsvítí. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const form = $('[data-form]');
  if (form) form.addEventListener('submit', (e) => { e.preventDefault(); let first; $$('[required]', form).forEach((i) => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.setAttribute('aria-invalid', bad); if (bad && !first) first = i; }); $('.bad', form).hidden = !first; $('.ok', form).hidden = !!first; if (first) first.focus(); });
  const fl = $('[data-filter]');
  if (fl) { const bs = $$('button', fl), it = $$('.sheet'); bs.forEach((b) => b.addEventListener('click', () => { bs.forEach((x) => x.setAttribute('aria-pressed', x === b)); it.forEach((i) => { i.hidden = b.dataset.f !== 'vse' && i.dataset.f !== b.dataset.f; }); })); }
  const aud = $('[data-aud]');
  if (aud) { const A = { dev: ['Hledáte partnera na přípravu projektu od prověření po správu.', 'Prohlédnout výkresy →', '/demo/realty/projekty/'], inv: ['Každou příležitost posuzujeme právně, technicky i ekonomicky a pravidelně reportujeme.', 'Probrat strategii →', '/demo/realty/kontakt/'], maj: ['Vaše nemovitost může mít další život. Začneme schůzkou a navrhneme možnosti rozvoje.', 'Domluvit schůzku →', '/demo/realty/kontakt/'] }; const bs = $$('button', aud), c = $('[data-c]', aud); bs.forEach((b) => b.addEventListener('click', () => { bs.forEach((x) => x.setAttribute('aria-pressed', x === b)); const a = A[b.dataset.a]; $('[data-p]', aud).textContent = a[0]; c.textContent = a[1]; c.href = a[2]; })); }

  const build = $('[data-build]'); if (!build) return;
  const stage = $('.stage', build), beats = $$('.beat', stage), g = $$('[data-g]', stage), sl = $$('.sl', stage), cl = $$('.cl', stage), wn = $$('.wn', stage), cr = $('.crane', stage), NAMES = ['Parcela', 'Analýza a prověření', 'Návrh a rozpočet', 'Realizace a dohled', 'Předání a správa'];
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const lit = wn.map((_, i) => (i * 37 + 11) % 100 < 58), sN = $('[data-s-n]', stage), sT = $('[data-s-t]', stage);
  const draw = () => {
    const r = build.getBoundingClientRect(), q = clamp(-r.top / (r.height - innerHeight)), v = q * 5, n = Math.min(4, Math.floor(v));
    beats.forEach((b, i) => b.classList.toggle('on', i === n)); sN.textContent = `${n + 1} / 5`; sT.textContent = NAMES[n];
    stage.classList.toggle('night', q > .9); stage.style.setProperty('--p', q * 100 + '%');
    const t = (i) => clamp((v - i) * 1.5);
    g.forEach((el, i) => { el.style.setProperty('--t', i === 0 ? clamp(v * 2 + .35) : t(i)); el.style.setProperty('--o', i === 0 ? 1 - clamp(v - 1.6) * .85 : clamp((v - i) * 3)); });
    const f = clamp((v - 3) * 1.25); sl.forEach((s, i) => { s.style.opacity = f * 8 > i ? 1 : 0; }); cl.forEach((c) => c.style.setProperty('--t', f)); cr.style.setProperty('--cr', 1 - clamp((v - 4) * 2.4));
    const w = clamp((v - 4) * 1.6); wn.forEach((x, i) => { x.style.opacity = w * wn.length > i ? 1 : 0; x.classList.toggle('lit', lit[i]); });
  };
  let tick = false; addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; draw(); }); } }, { passive: true }); addEventListener('resize', draw); draw();
})();
