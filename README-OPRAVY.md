# M² Digital Agency – provedené opravy

## Co bylo opraveno v `index.html`

### 1. Formuláře – FormSubmit
- **Kontaktní formulář** (sekce #kontakt) – napojen na `https://formsubmit.co/kontakt@m2digitalagency.cz` metodou POST
- **Modální formulář** (poptávka balíčku) – stejné napojení
- Pole: `name`, `email`, `message` (textarea)
- Přidány: `_subject`, `_next` (redirect po odeslání), `_captcha` (vypnuto)

### 2. CSS chyby
- `items-center: center` → `align-items: center` (řádek 139, mobilní menu)
- Bento grid: hover efekt upraven na `.bento-item:hover::after` (záře jen u aktivní karty)

### 3. Lucide ikony
- URL změněna na:  
  `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`
- Přidána kontrola `typeof lucide !== 'undefined'` před voláním

### 4. SEO a přístupnost
- Přidán meta description
- `aria-label` a `aria-expanded` u hamburger menu
- `rel="noopener"` u externích odkazů

### 5. Další úpravy
- Odkaz na obchodní podmínky: `http` → `https`
- Tlačítka „Jak probíhá spolupráce“ a šipka v designu vedou na `#kontakt`
- Mobilní menu: výměna ikony menu ↔ X při otevření/zavření

---

## Jak nasadit na GitHub

1. Otevřete repozitář: https://github.com/marekmarek-web/m2digitalagency
2. Zkopírujte obsah z `index.html` v této složce do souboru `index.html` v repozitáři
3. Commitněte a pushněte změny

### První použití FormSubmit

- Po prvním odeslání formuláře přijde na **kontakt@m2digitalagency.cz** e-mail od FormSubmit s odkazem na ověření
- Klikněte na odkaz a ověřte e-mail – od té chvíle budou poptávky chodit na váš e-mail

---

## Podstránky – provedené opravy

### tvorba-webu-cena
- CSS: `items-center` → `align-items: center`
- Lucide: správná URL
- Formulář: FormSubmit POST místo AJAX
- Odstraněna duplicitní navigace
- Logo a odkazy: `../index.html` pro podstránky
- Prodejní úpravy: druhý CTA v hero, vylepšené nadpisy formuláře

### web-na-pronajem
- Opravena rozbitá HTML (FAQ sekce – chybějící `</details>`, `</div>`)
- Odstraněna duplicitní navigace a mobilní menu
- Lucide: správná URL
- Formulář: FormSubmit POST místo AJAX
- Logo a odkazy: `../index.html`
- Prodejní úpravy: nadpis „Získejte web bez vstupní investice“, vylepšené placeholder texty

### web-pro-zivnostniky
- Lucide: správná URL
- Formulář: FormSubmit POST místo AJAX
- Logo a odkazy: `../index.html`
- Prodejní úpravy: nadpis „Získejte nabídku na míru“, vylepšené placeholder texty

### obchodni-podminky
- CSS: `items-center: center` → `align-items: center` (mobilní menu)
- Lucide: správná URL
- Odkazy: `../index.html` a `../index.html#sluzby` atd.
