/* NormattivaStudio — due rifiniture sulla ricerca integrata di Material,
   senza sostituirla: aggiunge l'etichetta della legge/codice di
   provenienza sopra ogni risultato (dato già presente nel percorso della
   pagina, semplicemente non mostrato), e mostra solo il primo paragrafo
   di anteprima (il resto — problema reale segnalato: articoli lunghi
   comparivano per intero nei risultati — troncato via CSS a due righe,
   vedi .md-search-result__article p in normativa.css).

   Non risolve la mescolanza di risultati da fonti diverse né l'ordine
   dei risultati (richiederebbe un motore di ricerca su misura, non solo
   questi due interventi) — vedi la discussione in chat.
*/
(function () {
  function pronto(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  // "base" (in __config, iniettato da Material in ogni pagina) è il
  // percorso relativo dalla pagina corrente alla radice del sito —
  // funziona identico in locale e online (GitHub Pages pubblica sotto
  // un sottopercorso, "/normattiva_studio/", che qui non va assunto a
  // mano ma calcolato a runtime).
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

  pronto(function () {
    var lista = document.querySelector(".md-search-result__list");
    if (!lista) { return; }
    var radice = radiceSito();

    function elabora(li) {
      if (li.dataset.nsElaborato) { return; }
      li.dataset.nsElaborato = "1";

      var link = li.querySelector("a.md-search-result__link");
      var articolo = li.querySelector("article.md-search-result__article");
      var h1 = articolo && articolo.querySelector("h1");
      if (!link || !articolo || !h1) { return; }

      if (radice) {
        try {
          var linkUrl = new URL(link.href);
          var rel = linkUrl.pathname.slice(radice.pathname.length);
          var segmenti = decodeURIComponent(rel).split("/").filter(Boolean);
          var fonte = segmenti[0];
          if (fonte && fonte !== h1.textContent.trim()) {
            var etichetta = document.createElement("div");
            etichetta.className = "ns-search-fonte";
            etichetta.textContent = fonte;
            articolo.insertBefore(etichetta, h1);
          }
        } catch (e) { /* nessuna etichetta se il calcolo fallisce */ }
      }

      var paragrafi = articolo.querySelectorAll("p");
      for (var i = 1; i < paragrafi.length; i++) {
        paragrafi[i].remove();
      }
    }

    new MutationObserver(function () {
      lista.querySelectorAll("li.md-search-result__item").forEach(elabora);
    }).observe(lista, { childList: true, subtree: true });
  });
})();
