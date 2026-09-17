/* NormattivaStudio — riorganizzazione della barra superiore, richiesta
   esplicita dell'utente: la lente di ricerca esce dalla barra sottile e
   diventa un pulsante tondo fisso sopra quello delle segnalazioni
   (stesso stile, più grande); nella barra, l'icona del menu prende il
   posto della ricerca e un'icona "home" prende il posto che aveva il
   menu. La funzione di ricerca resta quella vera di Material — il
   nuovo pulsante si limita a "cliccare" al posto dell'utente
   sull'interruttore originale (nascosto via CSS, mai rimosso), così
   tutta la logica di apertura/chiusura resta quella di Material stessa. */
(function () {
  function pronto(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  pronto(function () {
    var etichettaRicerca = document.querySelector('label.md-header__button[for="__search"]');
    var logo = document.querySelector(".md-header__button.md-logo");
    if (!etichettaRicerca || !logo) { return; }

    // Icona "home" al posto dell'icona del menu, stesso link del logo.
    var home = document.createElement("a");
    home.className = "md-header__button md-icon";
    home.href = logo.getAttribute("href");
    home.title = "Home";
    home.setAttribute("aria-label", "Home");
    home.innerHTML =
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>' +
      "</svg>";
    logo.insertAdjacentElement("afterend", home);

    // Nuovo pulsante tondo, sopra quello delle segnalazioni (stesso
    // stilema, più grande) — "clicca" per conto dell'utente
    // sull'interruttore vero di Material, rimasto nella barra ma
    // nascosto via CSS (vedi normativa.css).
    var bottone = document.createElement("button");
    bottone.type = "button";
    bottone.className = "ns-cerca-btn";
    bottone.title = "Cerca";
    bottone.setAttribute("aria-label", "Cerca");
    bottone.innerHTML =
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
      "</svg>";
    bottone.addEventListener("click", function () {
      etichettaRicerca.click();
      var input = document.querySelector(".md-search__input");
      if (input) { setTimeout(function () { input.focus(); }, 50); }
    });
    document.body.appendChild(bottone);
  });
})();
