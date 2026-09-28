/* NormattivaStudio — rifiniture sulla ricerca integrata di Material,
   senza sostituirla:
   1. Etichetta della legge/codice di provenienza sopra ogni risultato
      (dato già presente nel percorso della pagina, semplicemente non
      mostrato).
   2. Numero dell'articolo colorato in oro nel titolo del risultato,
      come i link nel testo (vedi --ns-gold in normativa.css).
   3. Anteprima troncata al primo blocco (paragrafo O elenco) —
      problema reale segnalato: un articolo con più paragrafi separati
      (es. un elenco "1° ...", "2° ...", ciascuno un <p> a sé, non un
      vero <ol>) mostrava sia testo integrale sia, in altri casi, solo i
      numeri di un elenco vero senza il testo associato. Gestiti
      esplicitamente entrambi i casi: paragrafi successivi al primo
      rimossi, e se il primo blocco è un elenco vero (<ol>/<ul>) tenuta
      solo la prima voce.
   4. Il testo evidenziato per il termine cercato (parametro '?h=' nel
      link) non resta più acceso quando si apre l'articolo vero — tolto
      SOLO dal contenuto reale della pagina (.md-content__inner), mai
      dall'elenco dei risultati, dove evidenziare il termine trovato
      resta utile.

   Non risolve la mescolanza di risultati da fonti diverse né l'ordine
   dei risultati (richiederebbe un motore di ricerca su misura, non solo
   questi interventi) — vedi la discussione in chat.
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
    // (4) Toglie l'evidenziazione del termine cercato dalla pagina
    // dell'articolo vero — resta solo nell'elenco dei risultati.
    // Material la inserisce DOPO il caricamento iniziale (verificato dal
    // vivo: una rimozione una tantum a questo punto non la intercetta),
    // quindi va osservata nel tempo, non solo tolta una volta sola.
    var contenuto = document.querySelector(".md-content__inner");
    if (contenuto) {
      var spogliaEvidenziazione = function () {
        contenuto.querySelectorAll("mark").forEach(function (m) {
          m.replaceWith(document.createTextNode(m.textContent));
        });
      };
      spogliaEvidenziazione();
      new MutationObserver(spogliaEvidenziazione)
        .observe(contenuto, { childList: true, subtree: true });
    }

    var lista = document.querySelector(".md-search-result__list");
    if (!lista) { return; }
    var radice = radiceSito();

    // Nessun segnaposto "già elaborato": Material a volte costruisce un
    // risultato in più passaggi (l'osservatore può scattare su un
    // contenuto ancora incompleto, es. un <ol> non ancora popolato di
    // tutte le voci) — bug reale, trovato dal vivo: un segnaposto messo
    // alla prima chiamata faceva ignorare i passaggi successivi che
    // completavano il contenuto. Ogni passo qui sotto controlla da sé se
    // è già stato applicato, quindi rieseguire l'intera funzione ad ogni
    // mutazione è sicuro (nessun doppio inserimento, nessun errore).
    function elabora(li) {
      var link = li.querySelector("a.md-search-result__link");
      var articolo = li.querySelector("article.md-search-result__article");
      var h1 = articolo && articolo.querySelector("h1");
      if (!link || !articolo || !h1) { return; }

      // (1) Etichetta della fonte, dal percorso reale della pagina.
      if (radice && !articolo.querySelector(".ns-search-fonte")) {
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

      // (2) Numero dell'articolo in oro — solo se il titolo è
      // davvero "Art. N..." (non tocca i titoli di legge/codice). Anche
      // senza rubrica (solo "Art. N", nessun " - "): bug reale segnalato,
      // in quel caso restava del tutto senza colore. Il colore del
      // numero stesso, quando corrisponde al termine cercato, è forzato
      // da Material via 'mark{color:var(--md-accent-fg-color)}' più
      // specifico del nostro span — vedi .ns-search-numero mark in
      // normativa.css, che lo fa tornare a ereditare l'oro.
      if (/^Art\.\s/.test(h1.textContent) && !h1.querySelector(".ns-search-numero")) {
        var html = h1.innerHTML;
        var idxSep = html.indexOf(" - ");
        var numeroHtml = idxSep !== -1 ? html.slice(0, idxSep) : html;
        var restoHtml = idxSep !== -1 ? html.slice(idxSep) : "";
        h1.innerHTML = '<span class="ns-search-numero">' + numeroHtml + "</span>" + restoHtml;
      }

      // (3) Solo il primo blocco (paragrafo o elenco) come anteprima.
      var blocchi = articolo.querySelectorAll(":scope > p, :scope > ol, :scope > ul");
      for (var i = 1; i < blocchi.length; i++) {
        blocchi[i].remove();
      }
      if (blocchi.length) {
        var primo = blocchi[0];
        if (primo.tagName === "OL" || primo.tagName === "UL") {
          var voci = primo.querySelectorAll("li");
          for (var j = 1; j < voci.length; j++) {
            voci[j].remove();
          }
        }
      }
    }

    new MutationObserver(function () {
      lista.querySelectorAll("li.md-search-result__item").forEach(elabora);
    }).observe(lista, { childList: true, subtree: true });
  });
})();
