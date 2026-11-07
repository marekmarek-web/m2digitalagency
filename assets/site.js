/* M² Digital Agency: interakce návrhu. Bez knihoven a bez odesílání dat. */
(() => {
  /* adresa vlastní služby pro formuláře, viz formular-api/README.md */
  const LEAD_URL = 'https://m2-formular.vercel.app/api/lead'; const OPENED = Date.now();
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (n) => n.toLocaleString('cs-CZ').replace(/ /g, ' ');

  /* objevování při skrolování */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  $$('.rv').forEach((el) => io.observe(el));
  const playIo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add('play'); }), { threshold: 0.35 });
  $$('[data-play],[data-ranges]').forEach((el) => playIo.observe(el));

  /* navigace */
  const links = $('[data-links]');
  if (links) {
    const pill = $('.lk-pill', links);
    const to = (a, show = true) => { if (!a) { pill.style.setProperty('--o', 0); return; } pill.style.setProperty('--x', a.offsetLeft + 'px'); pill.style.setProperty('--w', a.offsetWidth + 'px'); pill.style.setProperty('--o', show ? 1 : 0); };
    const cur = $('a[aria-current]', links);
    const rest = () => to(cur);
    $$('a', links).forEach((a) => { a.addEventListener('pointerenter', () => to(a)); a.addEventListener('focus', () => to(a)); });
    links.addEventListener('pointerleave', rest);
    addEventListener('load', rest); document.fonts?.ready.then(rest);
  }
  const burger = $('.burger'), menu = $('#menu');
  if (burger && menu) {
    const set = (open) => { burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu'); menu.hidden = !open; document.body.classList.toggle('menu-open', open); };
    burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); } });
    matchMedia('(min-width:1021px)').addEventListener('change', (e) => e.matches && set(false));
  }

  /* obory v úvodní ukázce */
  const OBORY = [
    { k: 'Instalatér Praha', h: 'Instalatérské práce bez kompromisů.', p: 'Havárie vody, výměny baterií i kompletní rozvody. Férová cena domluvená předem.', c: 'Zavolat ihned', s: ['Havárie a opravy', 'Montáže a výměny', 'Rekonstrukce'], v: { mb: '#FFFFFF', mf: '#14213A', ma: '#D2571F', mc: '#fff', ms: '#F4F1EC', mt: 'var(--head)', mr: '10px', mr2: '10px' } },
    { k: 'Účetní Brno', h: 'Přehled v číslech. Klid v termínech.', p: 'Účetnictví pro OSVČ a malé firmy. Srozumitelně, včas a bez stresu.', c: 'Domluvit konzultaci', s: ['Daňová evidence', 'DPH + kontrolní hlášení', 'Mzdy'], v: { mb: '#111110', mf: '#F4F3EE', ma: '#C5A059', mc: '#111', ms: '#20201D', mt: 'var(--head)', mr: '6px', mr2: '6px' } },
    { k: 'Realitní makléř', h: 'Prodej nemovitosti s jasným postupem.', p: 'Osobní značka je klíč. Web představí vás, vaše zkušenosti a další krok.', c: 'Ozvat se makléři', s: ['Prodej', 'Pronájem', 'Ocenění'], v: { mb: '#F1EBE0', mf: '#2A211A', ma: '#2A211A', mc: '#F1EBE0', ms: '#E5DCCC', mt: 'Georgia,"Times New Roman",serif', mr: '99px', mr2: '4px' } },
    { k: 'Advokátní kancelář', h: 'Odborná pomoc, která působí jistě.', p: 'Web, který vyzařuje profesionalitu a diskrétnost. Bez zbytečných slov.', c: 'Domluvit schůzku', s: ['Smlouvy', 'Spory', 'Poradenství'], v: { mb: '#17322A', mf: '#F2EFE6', ma: '#E7DDBE', mc: '#17322A', ms: '#21443A', mt: 'Georgia,"Times New Roman",serif', mr: '2px', mr2: '2px' } },
    { k: 'Kadeřnictví', h: 'Ukažte svou práci. Klienti se objednají sami.', p: 'Galerie, ceník a kontakt na jednom místě, ve vašem městě.', c: 'Objednat se', s: ['Střih', 'Barvení', 'Péče'], v: { mb: '#F8E7DF', mf: '#4A1F18', ma: '#A5402D', mc: '#fff', ms: '#FFF4EF', mt: 'var(--head)', mr: '99px', mr2: '24px' } },
    { k: 'Architektonické studio', h: 'Prostor, který dává smysl.', p: 'Realizace ve velkém formátu a jasná cesta k první schůzce.', c: 'Začít projekt', s: ['Studie', 'Interiér', 'Realizace'], v: { mb: '#FFFFFF', mf: '#111', ma: '#111', mc: '#fff', ms: '#EFEFEF', mt: 'var(--body)', mr: '0', mr2: '0' } },
  ];
  const stage = $('[data-stage]');
  if (stage) {
    const mw = $('[data-mw]', stage), tabs = $$('[data-o]', stage);
    const f = (n) => $(`[data-f=${n}]`, mw);
    let cur = 0, timer, stopped = calm, inView = true;
    const show = (i, run = true) => {
      cur = i; const o = OBORY[i];
      Object.entries(o.v).forEach(([k, v]) => mw.style.setProperty('--' + k, v));
      f('k').textContent = o.k; f('h').textContent = o.h; f('p').textContent = o.p; f('c').textContent = o.c;
      f('s').innerHTML = o.s.map((x) => `<span>${x}</span>`).join('');
      ['k', 'h', 'p', 'c', 's'].forEach((n, d) => { const el = f(n); el.classList.remove('fx'); void el.offsetWidth; el.style.animationDelay = d * 50 + 'ms'; el.classList.add('fx'); });
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i); const u = $('u', t); u.classList.remove('run'); if (j === i && run && !stopped) { void u.offsetWidth; u.classList.add('run'); } });
      const bar = tabs[i].parentElement; if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: tabs[i].offsetLeft - bar.clientWidth / 2 + tabs[i].offsetWidth / 2, behavior: calm ? 'auto' : 'smooth' });
      clearTimeout(timer); if (!stopped && inView) timer = setTimeout(() => show((cur + 1) % OBORY.length), 5000);
    };
    tabs.forEach((t, i) => t.addEventListener('click', () => { stopped = true; show(i, false); }));
    tabs.forEach((t, i) => t.addEventListener('keydown', (e) => { const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); const n = (i + d + tabs.length) % tabs.length; tabs[n].focus(); stopped = true; show(n, false); } }));
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; clearTimeout(timer); if (inView && !stopped) timer = setTimeout(() => show((cur + 1) % OBORY.length), 5000); }).observe(stage);
    show(0);
  }
  /* přepínač počítač / telefon */
  $$('[data-stage],[data-prev]').forEach((box) => {
    const bs = $$('[data-dev]', box);
    bs.forEach((b) => b.addEventListener('click', () => { box.dataset.device = b.dataset.dev; bs.forEach((x) => x.setAttribute('aria-pressed', x === b)); }));
  });

  /* řazení informací */
  $$('[data-sort]').forEach((s) => {
    const b = $('button', s); let touched = false;
    const set = (st) => { s.dataset.state = st; b.textContent = st === 'messy' ? 'Seřadit informace' : 'Zamíchat zpět'; b.setAttribute('aria-pressed', st === 'ordered'); };
    b.addEventListener('click', () => { touched = true; set(s.dataset.state === 'messy' ? 'ordered' : 'messy'); });
    new IntersectionObserver(([e], o) => { if (e.isIntersecting && !touched) { setTimeout(() => !touched && set('ordered'), 900); o.disconnect(); } }, { threshold: 0.6 }).observe(s);
  });
  /* před a po */
  $$('[data-ba]').forEach((b) => { const i = $('input', b); const u = () => b.style.setProperty('--x', i.value + '%'); i.addEventListener('input', u); u(); });

  /* obrazec M z metrů čtverečních */
  const scene = $('[data-scene]');
  if (scene) {
    const grid = $('[data-gridm]', scene), tile = $('[data-scene-t]', scene), copy = $('.scene-c', scene);
    const N = innerWidth < 640 ? 18 : 24;
    grid.style.gridTemplateColumns = `repeat(${N},1fr)`;
    const P = { a: [[37, 348], [37, 92], [409, 442], [271, 580]], g: [[409, 442], [496, 514], [350, 660], [271, 580]], b: [[496, 514], [940, 92], [940, 992], [745, 992], [745, 566], [488, 800], [350, 660]], c: [[37, 375], [235, 573], [233, 755], [336, 675], [474, 813], [295, 992], [37, 992]] };
    const inside = (x, y, p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    const cells = [];
    for (let r = 0; r < N; r++) for (let q = 0; q < N; q++) {
      const el = document.createElement('i'); grid.append(el);
      const x = 37 + (q + 0.5) / N * 903, y = 92 + (r + 0.5) / N * 900;
      const kind = inside(x, y, P.g) ? 'g' : inside(x, y, P.a) || inside(x, y, P.b) || inside(x, y, P.c) ? 'w' : '';
      if (kind) cells.push({ el, kind, at: 0.08 + (x - 37) / 903 * 0.5 + ((q * 7 + r * 13) % 11) / 11 * 0.16 });
    }
    const tick = () => {
      const r = scene.getBoundingClientRect(), span = scene.offsetHeight - innerHeight;
      const p = calm ? 1 : Math.min(1, Math.max(0, -r.top / span));
      tile.style.setProperty('--p', Math.min(1, p * 1.5).toFixed(3));
      cells.forEach((c) => c.el.classList.toggle(c.kind, p >= c.at));
      copy.classList.toggle('alt', p > 0.55);
      $('[data-s2]', copy).setAttribute('aria-hidden', p <= 0.55); $('[data-s1]', copy).setAttribute('aria-hidden', p > 0.55);
    };
    let raf; addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }, { passive: true }); addEventListener('resize', tick); tick();
  }

  /* projekty */
  $$('[data-work]').forEach((w) => {
    const items = $$('.work-i', w), slides = $$('.work-s', w); let t;
    const PAN_SPEED = 220, PAN_MAX = 1600; // px za sekundu, stejná rychlost pro všechny náhledy
    const startPan = (s) => { const im = $('img', s), box = $('.brw-v', s); if (!im || !box) return; const d = Math.max(0, Math.min(PAN_MAX, im.offsetHeight - box.clientHeight)); if (d < 120) return; s.style.setProperty('--py', -d + 'px'); s.style.setProperty('--pt', (d / PAN_SPEED).toFixed(2) + 's'); s.classList.add('pan'); };
    const on = (i) => { items.forEach((x, j) => x.classList.toggle('on', j === i)); slides.forEach((x, j) => { x.classList.toggle('on', j === i); x.classList.remove('pan'); }); clearTimeout(t); t = setTimeout(() => !calm && startPan(slides[i]), 500); };
    items.forEach((a, i) => { a.addEventListener('pointerenter', () => on(i)); a.addEventListener('focus', () => on(i)); });
    new IntersectionObserver(([e], o) => { if (e.isIntersecting && !calm) { startPan(slides[0]); o.disconnect(); } }, { threshold: 0.3 }).observe(w);
  });

  /* otázky */
  $$('.acc button').forEach((b) => b.addEventListener('click', () => { const open = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', open); b.closest('.acc-i').classList.toggle('open', open); }));
  $$('.acc').forEach((a) => $('button', a)?.click());

  /* levný a dobrý web */
  $$('[data-cheap]').forEach((c) => { const bs = $$('[data-v]', c); bs.forEach((b) => b.addEventListener('click', () => { c.dataset.state = b.dataset.v; bs.forEach((x) => x.setAttribute('aria-pressed', x === b)); })); });
  /* záložky faktorů */
  $$('[data-tabs]').forEach((box) => { const ts = $$('[role=tab]', box), ps = $$('[role=tabpanel]', box); const sel = (i, fo) => { ts.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; }); ps.forEach((p, j) => { p.hidden = j !== i; }); if (fo) ts[i].focus(); ts[i].parentElement.scrollTo?.({ left: ts[i].offsetLeft - 40, behavior: calm ? 'auto' : 'smooth' }); }; ts.forEach((t, i) => { t.addEventListener('click', () => sel(i)); t.addEventListener('keydown', (e) => { const d = ['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(e.key) ? -1 : 0; if (d) { e.preventDefault(); sel((i + d + ts.length) % ts.length, true); } }); }); sel(0); });
  /* anatomie webu */
  $$('[data-anat]').forEach((box) => { const bs = $$('.anat-l button', box), zs = $$('[data-z]', box); const sel = (i) => { bs.forEach((b, j) => b.setAttribute('aria-expanded', j === i)); zs.forEach((z) => z.classList.toggle('on', +z.dataset.z === i)); }; bs.forEach((b, i) => b.addEventListener('click', () => sel(i))); zs.forEach((z) => z.addEventListener('click', () => sel(+z.dataset.z))); sel(0); });
  /* psaní do vyhledávače */
  $$('[data-type]').forEach((s) => { if (calm) return; const words = s.dataset.type.split('|'), el = $('span', s); let w = 0, i = words[0].length, back = true; const step = () => { const word = words[w]; i += back ? -1 : 1; el.textContent = word.slice(0, i); let d = back ? 45 : 85; if (!back && i === word.length) { back = true; d = 1700; } else if (back && i === 0) { back = false; w = (w + 1) % words.length; d = 300; } setTimeout(step, d); }; setTimeout(step, 1700); });
  /* průběh kroků */
  $$('[data-steps]').forEach((s) => { const bar = $('.steps-bar', s); const t = () => { const r = $('.steps-l', s).getBoundingClientRect(); const p = Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height)); bar.style.setProperty('--p', p.toFixed(3)); }; addEventListener('scroll', t, { passive: true }); t(); });
  /* srovnání z ceníku */
  $$('[data-compare]').forEach((c) => { const inp = $('[data-months]', c), max = 47520; const u = () => { const m = +inp.value, r = m * 990; $('[data-m]', c).textContent = m; $('[data-r]', c).textContent = fmt(r) + ' Kč'; $('[data-rb]', c).style.setProperty('--w', r / max * 100 + '%'); $('[data-st]', c).style.setProperty('--w', 15000 / max * 100 + '%'); $('[data-by]', c).style.setProperty('--w', 35000 / max * 100 + '%'); inp.style.setProperty('--f', (m - 12) / 36 * 100 + '%'); }; inp.addEventListener('input', u); u(); });
  /* obsah dokumentu */
  $$('[data-legal]').forEach((l) => { const as = $$('.toc a', l); const io2 = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) as.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-30% 0px -60% 0px' }); $$('.doc section', l).forEach((s) => io2.observe(s)); });
  /* cookies, jen volba v tomto prohlížeči */
  $$('[data-ck]').forEach((c) => { const i = $('[data-ck-input]', c), s = $('[data-ck-s]', c); const show = () => { s.textContent = i.checked ? 'Zapnuto' : 'Vypnuto'; }; try { i.checked = localStorage.getItem('m2-ck') === '1'; } catch {} i.addEventListener('change', () => { try { localStorage.setItem('m2-ck', i.checked ? '1' : '0'); } catch {} show(); document.dispatchEvent(new Event('m2ck')); }); show(); });

  /* cookie lišta: ukáže se při první návštěvě, dokud si člověk nevybere */
  const ckb = $('[data-ckb]');
  if (ckb) {
    let saved = null; try { saved = localStorage.getItem('m2-ck'); } catch { saved = '0'; }
    const hide = () => { ckb.hidden = true; };
    if (saved === null && !location.pathname.startsWith('/cookies')) ckb.hidden = false;
    const pick = (v) => { try { localStorage.setItem('m2-ck', v); } catch {} hide(); document.dispatchEvent(new Event('m2ck-saved')); };
    $('[data-ckb-yes]', ckb).addEventListener('click', () => pick('1'));
    $('[data-ckb-no]', ckb).addEventListener('click', () => pick('0'));
    document.addEventListener('m2ck', hide);
  }

  /* Google Analytics 4: načte se až po souhlasu (m2-ck = 1). Sem doplňte měřicí ID ve tvaru G-XXXXXXXXXX */
  const GA_ID = 'G-RQECF3C3N7';
  let gaOn = false;
  const ga = () => {
    if (!GA_ID) return;
    let ok = false; try { ok = localStorage.getItem('m2-ck') === '1'; } catch {}
    window['ga-disable-' + GA_ID] = !ok;
    if (!ok) { if (gaOn) document.cookie.split(';').forEach((c) => { const n = c.split('=')[0].trim(); if (n === '_ga' || n.startsWith('_ga_')) document.cookie = n + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + location.hostname.replace(/^www\./, ''); }); return; }
    if (gaOn) return; gaOn = true;
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', GA_ID);
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID); document.head.append(s);
  };
  ga(); document.addEventListener('m2ck', ga); document.addEventListener('m2ck-saved', ga);

  /* okno s objednávkou */
  const modal = $('#objednavka');
  if (modal) {
    let back;
    const open = (pkg, from) => { back = from; $('[data-pkg]', modal).textContent = pkg; $('[data-pkg-input]', modal).value = pkg; $('.sent', modal).hidden = true; modal.hidden = false; document.body.style.overflow = 'hidden'; $('input[name=name]', modal).focus(); };
    const close = () => { modal.hidden = true; document.body.style.overflow = ''; back?.focus(); };
    $$('[data-order]').forEach((b) => b.addEventListener('click', () => open(b.dataset.order, b)));
    $$('[data-close]', modal).forEach((b) => b.addEventListener('click', close));
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { const f = $$('button,input,textarea,a[href]', modal).filter((x) => x.type !== 'hidden' && x.offsetParent); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    });
  }
  /* formuláře: kontrola polí, v návrhu se nic neodesílá */
  $$('[data-form]').forEach((form) => {
    const err = (input, msg) => { const f = input.closest('.fld'); f.classList.toggle('bad', !!msg); $('em', f)?.remove(); input.setAttribute('aria-invalid', !!msg); if (msg) { const e = document.createElement('em'); e.textContent = msg; f.append(e); } };
    const check = (i) => { if (i.required && !i.value.trim()) return i.name === 'email' ? 'Doplňte prosím e-mail.' : 'Doplňte prosím jméno.'; if (i.type === 'email' && i.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value)) return 'Tenhle e-mail nevypadá správně.'; return ''; };
    form.addEventListener('submit', (e) => {
      e.preventDefault(); let first;
      $$('input[required],input[type=email]', form).forEach((i) => { const m = check(i); err(i, m); if (m && !first) first = i; });
      if (first) { first.focus(); return; }
      const ok = $('[data-ok]', form), bad = $('[data-err]', form), btn = $('button[type=submit]', form);
      ok.hidden = bad.hidden = true;
      const data = new FormData(form); if (data.get('company_site')) { ok.hidden = false; return; }
      data.append('page', location.pathname); data.append('opened', String(OPENED));
      btn.disabled = true;
      fetch(LEAD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(data)) })
        .then((r) => r.ok ? r.json() : Promise.reject()).then((j) => { if (!j.ok) throw 0; ok.hidden = false; form.reset(); ok.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' }); })
        .catch(() => { bad.hidden = false; }).finally(() => { btn.disabled = false; });
    });
    $$('input', form).forEach((i) => i.addEventListener('input', () => i.closest('.fld')?.classList.contains('bad') && err(i, check(i))));
  });

  /* spodní tlačítko na telefonu se schová u kontaktu a patičky */
  const dock = $('[data-dock]');
  if (dock) { const targets = $$('#kontakt,.foot'); const vis = new Set(); const sync = () => dock.classList.toggle('off', vis.size > 0 || scrollY < 520); const o = new IntersectionObserver((es) => { es.forEach((e) => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)); sync(); }); targets.forEach((t) => o.observe(t)); addEventListener('scroll', sync, { passive: true }); sync(); }
})();
