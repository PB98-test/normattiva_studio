/* NormattivaStudio — registra il service worker (sw.js) e gestisce due
   avvisi legati alla connessione, richiesti esplicitamente dall'utente
   dopo aver visto lo stesso meccanismo funzionare in un altro progetto
   (OdG):
   1. un banner leggero, sempre visibile mentre il telefono segnala di
      essere offline (e che scompare da solo quando torna online);
   2. un riquadro in sovraimpressione sulla pagina che si stava già
      leggendo, quando si tocca un link interno mentre manca la rete e
      la pagina di destinazione non è tra quelle disponibili offline —
      blocca quella singola navigazione invece di lasciarla fallire a
      vuoto. Resta "in sovraimpressione" per davvero (non si naviga da
      nessuna parte, a differenza della vista di riserva dentro sw.js,
      che serve solo per il caso limite di una navigazione arrivata da
      fuori pagina — link esterno, indirizzo digitato, tasto indietro).

   Non serve conoscere qui l'elenco delle pagine precaricate (duplicarlo
   avrebbe richiesto tenerlo sincronizzato con sw.js in due posti): si
   chiede direttamente alla Cache Storage del browser, la stessa che il
   service worker riempie — un'unica fonte di verità. */
(function () {
  function pronto(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  function radiceSito() {
    var cfg = document.getElementById("__config");
    if (!cfg) { return null; }
    try {
      var base = JSON.parse(cfg.textContent).base;
      return new URL(base + "/", location.href);
    } catch (e) {
      return null;
    }
  }

  if ("serviceWorker" in navigator) {
    var radice = radiceSito();
    var swUrl = radice ? new URL("sw.js", radice).href : "/sw.js";
    // 'updateViaCache: "none"' compensa un limite reale di GitHub
    // Pages: a differenza di un server vero (Flask, come in OdG), non
    // lascia impostare "niente cache" sull'indirizzo del service
    // worker — ogni file, questo compreso, arriva con un
    // Cache-Control fisso a 10 minuti, senza eccezioni possibili
    // (verificato sugli header reali del sito pubblicato). Questa
    // opzione dice al telefono di ignorare quella cache HTTP e
    // controllare sempre la versione vera del file.
    navigator.serviceWorker.register(swUrl, { updateViaCache: "none" }).catch(function () {});
  }

  pronto(function () {
    // ── 1. Banner di connessione ──
    // Inserito come primo figlio di <body> (non 'position: fixed'
    // sovrapposto): l'intestazione di Material è 'sticky', quindi
    // aggiungere qui un elemento normale la spinge semplicemente più in
    // basso, senza dover indovinare uno z-index che non la copra né ne
    // venga coperto.
    var banner = document.createElement("div");
    banner.className = "ns-connessione-banner";
    banner.setAttribute("role", "status");
    banner.hidden = true;
    banner.textContent = "Sei offline — solo le pagine già disponibili si apriranno.";
    document.body.insertBefore(banner, document.body.firstChild);

    function aggiornaBanner() {
      banner.hidden = navigator.onLine;
    }
    window.addEventListener("online", aggiornaBanner);
    window.addEventListener("offline", aggiornaBanner);
    aggiornaBanner();

    // ── 2. Riquadro in sovraimpressione per un link non disponibile ──
    // Stesso linguaggio visivo del popup di segnalazione problemi
    // (segnalazioni.js): stesse classi CSS, così non serve duplicare
    // nulla in normativa.css.
    var overlay = document.createElement("div");
    overlay.className = "ns-segnala-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="ns-segnala-popup" role="dialog" aria-label="Pagina non disponibile offline">' +
      '<h3>Pagina non disponibile offline</h3>' +
      '<p class="ns-segnala-hint">Questa pagina non è tra quelle salvate per l’uso senza rete (solo la home e gli indici dei codici lo sono). Riprova quando torni in connessione.</p>' +
      '<div class="ns-segnala-azioni">' +
      '<button type="button" class="ns-btn ns-btn--primario" data-azione="chiudi">Ho capito</button>' +
      "</div></div>";
    document.body.appendChild(overlay);

    function chiudiOverlay() { overlay.hidden = true; }
    overlay.querySelector('[data-azione="chiudi"]').addEventListener("click", chiudiOverlay);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) { chiudiOverlay(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) { chiudiOverlay(); }
    });

    document.addEventListener("click", function (e) {
      if (navigator.onLine || !("caches" in window)) { return; }
      var link = e.target.closest && e.target.closest("a[href]");
      if (!link) { return; }
      var url;
      try { url = new URL(link.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) { return; }
      if (url.pathname === location.pathname) { return; }  // ancora sulla stessa pagina, non è una navigazione

      // Async per forza (caches.match lo è): si blocca SEMPRE la
      // navigazione subito, poi si decide se farla proseguire per
      // davvero (era comunque salvata) o mostrare l'avviso.
      e.preventDefault();
      caches.match(link.href).then(function (trovata) {
        if (trovata) { location.href = link.href; }
        else { overlay.hidden = false; }
      });
    });
  });
})();
