(() => {
  const BASE = 990, DISC = 0.8, MONTHS = 24;
  const fmt = (n) => n.toLocaleString('cs-CZ').replace(/ /g, ' ');
  document.querySelectorAll('[data-pt]').forEach((box) => {
    const btns = box.querySelectorAll('[data-pt-m]'), v = box.querySelector('[data-pt-v]'), was = box.querySelector('[data-pt-was]'), sub = box.querySelector('[data-pt-sub]');
    const set = (m) => {
      const two = m === 24, price = two ? Math.round(BASE * DISC) : BASE;
      box.dataset.m = m; v.textContent = fmt(price);
      was.innerHTML = two ? `<s>${fmt(BASE)} Kč</s>` : '';
      sub.innerHTML = two ? `${fmt(price * MONTHS)} Kč za ${MONTHS} měsíců, <strong>ušetříte ${fmt((BASE - price) * MONTHS)} Kč</strong>` : 'Min. 12 měsíců, bez vstupní investice';
      btns.forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.ptM === m)));
    };
    btns.forEach((b) => b.addEventListener('click', () => set(+b.dataset.ptM)));
  });
})();
