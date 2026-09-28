/* NormattivaStudio — riorganizzazione della barra superiore, richiesta
   esplicita dell'utente: la lente di ricerca esce dalla barra sottile e
   diventa un pulsante tondo fisso sopra quello delle segnalazioni
   (stesso stile, più grande); nella barra, l'icona del menu prende il
   posto della ricerca (il logo, già cliccabile verso la home, basta da
   solo — niente icona home separata, tolta dopo la prima versione). La
   funzione di ricerca resta quella vera di Material — il nuovo pulsante
   si limita a "cliccare" al posto dell'utente sull'interruttore
   originale (nascosto via CSS, mai rimosso), così tutta la logica di
   apertura/chiusura resta quella di Material stessa. */
(function () {
  function pronto(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  pronto(function () {
    var etichettaRicerca = document.querySelector('label.md-header__button[for="__search"]');
    if (!etichettaRicerca) { return; }

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
      '<svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
      "</svg>";
    bottone.addEventListener("click", function () {
      etichettaRicerca.click();
      var input = document.querySelector(".md-search__input");
      if (input) { setTimeout(function () { input.focus(); }, 50); }
    });
    document.body.appendChild(bottone);

    // Segnalato dall'utente: sul telefono vero, chiudendo la ricerca i
    // due pulsanti tondi (questo e quello di segnalazione) escono per
    // un istante dallo schermo prima di rimettersi a posto. Non
    // riproducibile qui (serve una tastiera virtuale vera, che apre e
    // chiude il riquadro di ricerca — nessun browser automatizzato in
    // questo ambiente la simula: testato aprendo/chiudendo la ricerca
    // via JS, nessun movimento, nessuna trasformazione su html/body).
    // Causa più probabile, comune su mobile: "position: fixed;
    // bottom: ..." è ancorato al viewport di LAYOUT, ma quando la
    // tastiera si chiude e il viewport VISIBILE torna ad allargarsi,
    // alcuni browser mobili ridisegnano i "fixed" con un fotogramma di
    // ritardo rispetto al vero e proprio resize — da qui il salto.
    // Fix tentato: riancorare i due pulsanti allo spazio davvero
    // visibile (VisualViewport, se il browser lo supporta) ad ogni suo
    // resize/scroll, invece di fidarsi ciecamente del solo CSS — da
    // confermare sul telefono vero, qui non verificabile fino in fondo.
    if (window.visualViewport) {
      var segnalaBtn = document.querySelector(".ns-segnala-btn");
      var riancora = function () {
        var vv = window.visualViewport;
        var scarto = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        if (segnalaBtn) { segnalaBtn.style.bottom = (20 + scarto) + "px"; }
        bottone.style.bottom = (76 + scarto) + "px";
      };
      window.visualViewport.addEventListener("resize", riancora);
      window.visualViewport.addEventListener("scroll", riancora);
    }
  });
})();
