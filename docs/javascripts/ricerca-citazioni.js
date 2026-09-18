/* NormattivaStudio — motore di ricerca su misura per citazioni esatte
   (es. "133 cp", "1339 cc", "133 bis cpp", "cds 133"), pensato per
   intercettare PRIMA di Lunr i casi in cui l'utente sa già cosa cerca:
   un numero di articolo più la sigla di un codice o di una legge.

   Perché serve: Lunr (il motore di ricerca compilato dentro Material)
   applica un jolly di fine termine non disattivabile a ogni parola
   della query — "133" combacia anche con "1330".."1339" con lo stesso
   peso, e la sigla del codice/legge (che pure esiste nel percorso di
   ogni pagina) non viene mai indicizzata da Lunr. Verificato dal vivo:
   cercare "133 cp" restituisce 75 risultati, i primi 10 tutti Codice
   Civile (1330-1339), l'Art. 133 CP vero non compare nemmeno tra i
   primi 14 — vedi la discussione in chat.

   Il dato per riconoscere una citazione esiste già in ogni file del
   vault (frontmatter 'codice'/'articolo', generato da splitter_vault.py
   per altri scopi) — questo file lo consuma da un indice leggero
   generato a tempo di pubblicazione (pubblica_vault.py,
   genera_indice_citazioni), senza toccare vault o motore di conversione.

   Non sostituisce Lunr: se la query è riconosciuta come citazione ED è
   trovata nell'indice, aggiunge una card in cima alla lista di sempre —
   quella sotto resta quella di Material, invariata, per la ricerca
   libera (scelta esplicita: se il riconoscimento sbaglia o l'indice non
   ha ancora quella voce, l'utente non perde comunque nulla).

   Due rifiniture in più sulla lista di Lunr stessa, richieste
   dall'utente dopo aver visto la prima versione dare troppo rumore:
   1. troncata a un numero massimo di voci (75, o "1.4k" per query più
      generiche, non si leggono comunque mai per intero);
   2. quando la query è una citazione riconosciuta, le voci dello STESSO
      codice/legge (e in particolare le varianti bis/ter/... dello
      stesso numero) vengono portate in cima al gruppo, prima di tutto
      il resto — Lunr non lo fa da solo (nessun concetto di "stesso
      codice" nel suo indice), ma il dato per farlo (l'url di ogni
      articolo del codice cercato) è lo stesso indice già caricato per
      la card esatta qui sopra.
*/
(function () {
  function pronto(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  // Stesso identico calcolo di ricerca.js (radiceSito): serve di nuovo
  // qui perché il link della nostra card deve risolvere correttamente
  // da QUALUNQUE pagina venga aperto il riquadro di ricerca, non solo
  // dalla home — un percorso relativo "a nudo" funzionerebbe solo se
  // risolto a partire dalla pagina corrente, che qui non conosciamo a
  // priori.
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

  var SUFFISSI = "bis|ter|quater|quinquies|sexies|septies|octies|novies|decies";
  // Solo le sigle corte, tutte lettere, dei 4 codici fissi: le uniche
  // per cui riconoscere anche la forma SENZA spazio ("133cp") non è
  // ambiguo. Le sigle delle altre leggi possono contenere cifre (es.
  // "dlgs285-92") — "133dlgs285-92" sarebbe comunque una query che
  // nessuno scriverebbe mai, non è una rinuncia reale.
  var SIGLE_CORTE = "cp|cpp|cc|cpc";

  var RE_NUM_ALIAS = new RegExp(
    "^(?:art\\.?|articolo)?\\s*(\\d+)\\s*[\\s-]?(" + SUFFISSI + ")?\\s+(.+)$", "i");
  var RE_ALIAS_NUM = new RegExp(
    "^(.+?)\\s+(?:art\\.?|articolo)?\\s*(\\d+)\\s*[\\s-]?(" + SUFFISSI + ")?$", "i");
  var RE_NUM_SIGLA_UNITE = new RegExp(
    "^(\\d+)(" + SUFFISSI + ")?(" + SIGLE_CORTE + ")$", "i");
  var RE_SIGLA_NUM_UNITE = new RegExp(
    "^(" + SIGLE_CORTE + ")(\\d+)(" + SUFFISSI + ")?$", "i");

  // Normalizza per il confronto: minuscolo, punti tolti (così "c.p.",
  // "C.d.S." funzionano come "cp"/"cds"), spazi ripetuti compattati —
  // stessa normalizzazione usata lato Python per generare la mappa
  // alias (vedi _normalizza_alias in pubblica_vault.py): se le due
  // cambiano in modo diverso, non si incontrano più.
  function normalizza(testo) {
    return testo.replace(/\./g, "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  // Riconosce la query come "numero [suffisso] + sigla" (in un ordine o
  // nell'altro, con o senza spazio nel solo caso delle sigle corte) —
  // restituisce {numero, suffisso, alias} o null se la query non ha
  // affatto la FORMA di una citazione. Non dice se la citazione esiste
  // davvero (serve l'indice, caricato altrove).
  function riconosci(query) {
    var q = normalizza(query);
    if (!q) { return null; }

    var m = RE_NUM_SIGLA_UNITE.exec(q) || RE_SIGLA_NUM_UNITE.exec(q);
    if (m) {
      // Le due regex hanno i gruppi in ordine diverso — distinti dal
      // primo carattere: se è una cifra, il numero viene prima.
      if (/^\d/.test(q)) {
        return { numero: m[1], suffisso: (m[2] || "").toLowerCase(), alias: m[3] };
      }
      return { numero: m[2], suffisso: (m[3] || "").toLowerCase(), alias: m[1] };
    }

    m = RE_NUM_ALIAS.exec(q);
    if (m) {
      return { numero: m[1], suffisso: (m[2] || "").toLowerCase(), alias: m[3] };
    }
    m = RE_ALIAS_NUM.exec(q);
    if (m) {
      return { numero: m[2], suffisso: (m[3] || "").toLowerCase(), alias: m[1] };
    }
    return null;
  }

  // Indice caricato una sola volta, alla prima query riconosciuta come
  // citazione (non subito al caricamento della pagina: un file in più
  // da scaricare per ogni visitatore, quando la maggior parte delle
  // ricerche non ne ha affatto bisogno). 'indiceRisolto' è la stessa
  // cosa ma disponibile SUBITO (non in una promise) una volta arrivata
  // — usata da riordina()/tronca(), che devono poter agire anche
  // quando l'observer scatta di nuovo prima che la fetch iniziale sia
  // tornata la prima volta.
  var indicePromise = null;
  var indiceRisolto = null;
  function caricaIndice(radice) {
    if (!indicePromise) {
      var url = radice ? new URL("assets/citazioni.json", radice).href
                        : "assets/citazioni.json";
      indicePromise = fetch(url).then(function (r) { return r.json(); })
        .then(function (dati) { indiceRisolto = dati; return dati; })
        .catch(function () { return null; });
    }
    return indicePromise;
  }

  function trova(indice, riconosciuta) {
    if (!indice) { return null; }
    var sigla = indice.alias[riconosciuta.alias];
    if (!sigla) { return null; }
    var voci = indice.articoli[sigla];
    if (!voci) { return null; }
    var chiave = riconosciuta.suffisso
      ? riconosciuta.numero + "-" + riconosciuta.suffisso
      : riconosciuta.numero;
    return voci[chiave] || null;
  }

  // Ultimo segmento del percorso di un URL (senza slash finale, senza
  // parametri) — lo "slug" del file (es. "art-133-bis-cp"), identico
  // sia nell'href che Material genera per un risultato di Lunr sia
  // nell'url che il nostro indice porta con sé: i nomi dei file del
  // vault sono già in quella forma, MkDocs non li rinomina. Confrontare
  // solo su questo, invece che sull'URL intero, evita ogni differenza
  // di codifica fra i due percorsi (relativo/assoluto, sottopercorso di
  // GitHub Pages) — serve solo per riconoscere "di che articolo si
  // tratta", non per navigarci.
  function slugDaUrl(url) {
    var pulito = url.split(/[?#]/)[0].replace(/\/+$/, "");
    var segmenti = pulito.split("/");
    try {
      return decodeURIComponent(segmenti[segmenti.length - 1] || "");
    } catch (e) {
      return segmenti[segmenti.length - 1] || "";
    }
  }

  var LIMITE_RISULTATI = 15;

  pronto(function () {
    var input = document.querySelector('input[name="query"], input.md-search__input');
    var lista = document.querySelector(".md-search-result__list");
    if (!input || !lista) { return; }
    var radice = radiceSito();

    // Tiene solo le prime LIMITE_RISULTATI voci della lista di Lunr (la
    // card esatta, se presente, non conta contro il limite: resta sempre
    // visibile) — richiesto dall'utente: anche 75 risultati, figuriamoci
    // "1.4k", non si leggono comunque mai per intero. Operazione che
    // rimuove soltanto: una volta troncata, richiamarla di nuovo con la
    // stessa lista non tocca più nulla (nessun ciclo con l'observer).
    function tronca() {
      var voci = Array.prototype.slice.call(lista.children)
        .filter(function (li) { return !li.classList.contains("ns-search-esatto"); });
      for (var i = LIMITE_RISULTATI; i < voci.length; i++) {
        voci[i].remove();
      }
    }

    // Quando la query è una citazione riconosciuta e TROVATA nell'indice
    // del suo codice/legge, porta in cima al gruppo (sotto alla card
    // esatta) prima le varianti bis/ter/... dello stesso numero, poi le
    // altre voci dello stesso codice — richiesto dall'utente: Lunr non ha
    // alcun concetto di "stesso codice", quindi lascia per esempio gli
    // articoli del Codice Civile (che combaciano solo per il numero)
    // davanti a un "133-bis" dello stesso Codice Penale appena cercato.
    // Il duplicato esatto (lo stesso articolo già mostrato dalla card in
    // cima) viene tolto dalla lista sotto, non solo spostato: mostrarlo
    // due volte non aggiungerebbe nulla.
    function riordina(indice, riconosciuta, sigla) {
      var vociCodice = (indice && indice.articoli && indice.articoli[sigla]) || {};
      var slugPerChiave = {};
      Object.keys(vociCodice).forEach(function (chiave) {
        slugPerChiave[slugDaUrl(vociCodice[chiave].url)] = chiave;
      });
      var chiaveEsatta = riconosciuta.suffisso
        ? riconosciuta.numero + "-" + riconosciuta.suffisso
        : riconosciuta.numero;

      var attuali = Array.prototype.slice.call(lista.children)
        .filter(function (li) { return !li.classList.contains("ns-search-esatto"); });

      var stessoNumero = [], stessoCodice = [], altro = [];
      attuali.forEach(function (li) {
        var link = li.querySelector("a.md-search-result__link");
        var slug = link ? slugDaUrl(link.href) : null;
        var chiave = slug ? slugPerChiave[slug] : undefined;
        if (chiave === undefined) { altro.push(li); return; }
        if (chiave === chiaveEsatta) { li.remove(); return; }  // doppione della card esatta
        if (chiave.split("-")[0] === riconosciuta.numero) { stessoNumero.push(li); }
        else { stessoCodice.push(li); }
      });

      var ordineDesiderato = stessoNumero.concat(stessoCodice, altro);
      var attualiRimaste = Array.prototype.slice.call(lista.children)
        .filter(function (li) { return !li.classList.contains("ns-search-esatto"); });
      var giaAPosto = attualiRimaste.length === ordineDesiderato.length
        && attualiRimaste.every(function (li, i) { return li === ordineDesiderato[i]; });
      if (giaAPosto) { return; }

      ordineDesiderato.forEach(function (li) { lista.appendChild(li); });
    }

    function aggiorna() {
      var riconosciuta = riconosci(input.value);
      var esistente = lista.querySelector(".ns-search-esatto");

      if (!riconosciuta) {
        if (esistente) { esistente.remove(); }
        tronca();
        return;
      }

      // Riordino e troncamento agiscono SUBITO, in modo sincrono, se
      // l'indice è già arrivato (anche da una query precedente) — non
      // hanno bisogno di aspettare la fetch qui sotto, che serve solo
      // per (ri)mettere a posto la card esatta. Il riordino va fatto
      // PRIMA del troncamento: una voce da promuovere in cima deve
      // sopravvivere al taglio, non sparire perché era oltre il limite
      // nell'ordine originale di Lunr.
      var sigla = indiceRisolto ? indiceRisolto.alias[riconosciuta.alias] : null;
      if (sigla) { riordina(indiceRisolto, riconosciuta, sigla); }
      tronca();

      // Chiave di confronto: se la card già in cima corrisponde già a
      // questa identica citazione, il resto qui sotto (fetch + inserimento
      // della card) non serve più — evita anche un ciclo con il
      // MutationObserver (il nostro stesso inserimento è anch'esso una
      // mutazione della lista, che altrimenti farebbe ripartire questa
      // funzione all'infinito).
      var chiaveRichiesta = riconosciuta.alias + "|" + riconosciuta.numero + "|" + riconosciuta.suffisso;
      if (esistente && esistente.dataset.nsChiave === chiaveRichiesta) {
        return;
      }

      caricaIndice(radice).then(function (indice) {
        // La query può essere già cambiata mentre l'indice era in
        // arrivo (fetch della primissima ricerca, rete lenta) —
        // riverifica sempre sul valore ATTUALE del campo.
        var ancoraValida = riconosci(input.value);
        var stessa = ancoraValida && ancoraValida.numero === riconosciuta.numero
          && ancoraValida.suffisso === riconosciuta.suffisso
          && ancoraValida.alias === riconosciuta.alias;
        var record = stessa ? trova(indice, riconosciuta) : null;

        var attuale = lista.querySelector(".ns-search-esatto");
        if (attuale) { attuale.remove(); }
        if (!record) { return; }

        var href = radice ? new URL(record.url, radice).href : record.url;
        var numeroVisibile = "Art. " + riconosciuta.numero
          + (riconosciuta.suffisso ? "-" + riconosciuta.suffisso : "");

        var li = document.createElement("li");
        li.className = "md-search-result__item ns-search-esatto";
        li.dataset.nsChiave = chiaveRichiesta;
        li.innerHTML =
          '<a href="' + href + '" class="md-search-result__link" tabindex="-1">' +
          '<article class="md-search-result__article">' +
          '<div class="ns-search-fonte"></div>' +
          '<h1><span class="ns-search-numero"></span></h1>' +
          "</article></a>";
        li.querySelector(".ns-search-fonte").textContent = record.fonte;
        var h1 = li.querySelector("h1");
        h1.querySelector(".ns-search-numero").textContent = numeroVisibile;
        if (record.rubrica) {
          h1.appendChild(document.createTextNode(" - " + record.rubrica));
        }
        lista.insertBefore(li, lista.firstChild);
      });
    }

    input.addEventListener("input", aggiorna);
    // Material ricostruisce la lista ad ogni risultato che arriva dal
    // worker di Lunr (stesso motivo per cui ricerca.js osserva la lista
    // con un MutationObserver, non basta elaborarla una volta) — se la
    // nostra card era presente, la ricostruzione la butta via insieme
    // al resto: va rimessa dopo ogni giro, non solo alla digitazione.
    new MutationObserver(aggiorna).observe(lista, { childList: true });
  });
})();
