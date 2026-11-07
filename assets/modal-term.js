// Výběr délky smlouvy v poptávkovém okně (jen u Partnerství / pronájmu).
// Volba se připojí k názvu balíčku, takže přijde v e-mailu v řádku „Balíček“.
(() => {
  const modal = document.getElementById('objednavka');
  if (!modal) return;
  const form = modal.querySelector('form'), pkg = modal.querySelector('[data-pkg-input]'), first = form.querySelector('label.fld');
  if (!form || !pkg || !first) return;
  const css = document.createElement('style');
  css.textContent = '.term{border:0;margin:0 0 14px;padding:0;display:grid;gap:8px}.term[hidden]{display:none}.term legend{font-weight:600;font-size:14px;margin-bottom:8px;padding:0}.term-o{position:relative;display:block;cursor:pointer}.term-o input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}.term-o span{display:grid;gap:2px;padding:13px 16px;border-radius:14px;background:var(--sheet);border:1.5px solid transparent;transition:border-color .2s,background .2s}.term-o b{font-size:16px}.term-o em{font-style:normal;font-weight:700;background:var(--gold);color:var(--ink);padding:2px 8px;border-radius:99px;font-size:12.5px;margin-left:6px}.term-o small{color:var(--ink-3);font-size:14px}.term-o input:checked+span{background:#fff;border-color:var(--ink)}.term-o input:focus-visible+span{outline:2px solid var(--gold);outline-offset:2px}';
  document.head.appendChild(css);
  const box = document.createElement('fieldset');
  box.className = 'term'; box.hidden = true;
  box.innerHTML = '<legend>Délka smlouvy</legend>'
    + '<label class="term-o"><input type="radio" name="term" value="Měsíčně (990 Kč měsíčně, min. 12 měsíců)" checked><span><b>Měsíčně</b><small>990 Kč měsíčně, min. 12 měsíců</small></span></label>'
    + '<label class="term-o"><input type="radio" name="term" value="Na 2 roky (792 Kč měsíčně, sleva 20 %)"><span><b>Na 2 roky<em>−20 %</em></b><small>792 Kč měsíčně, ušetříte 4 752 Kč</small></span></label>';
  first.parentNode.insertBefore(box, first);
  let base = '';
  const apply = () => { const v = box.querySelector('input:checked'); pkg.value = box.hidden ? base : base + ' – ' + v.value; };
  document.querySelectorAll('[data-order]').forEach((b) => b.addEventListener('click', () => {
    base = b.dataset.order; box.hidden = !/^(Partnerství|Pronájem)$/.test(base);
    box.querySelectorAll('input').forEach((i) => { i.disabled = box.hidden; });
    box.querySelector('input').checked = true; apply();
  }));
  box.addEventListener('change', apply);
})();
