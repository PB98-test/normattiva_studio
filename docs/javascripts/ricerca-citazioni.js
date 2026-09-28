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

   Tre rifiniture in più, richieste dall'utente dopo aver visto la prima
   versione dare troppo rumore:
   1. la lista di Lunr è troncata a un numero massimo di voci (75, o
      "1.4k" per query più generiche, non si leggono comunque mai per
      intero);
   2. le altre varianti dello stesso numero (per "133 cp": 133-bis,
      133-ter) compaiono come card "correlate" subito sotto quella
      esatta, costruite DALL'INDICE e non prese da Lunr — che mostra solo
      i primi 10 risultati e ne aggiunge 4 alla volta scorrendo, quindi
      non le avrebbe di norma nemmeno nella pagina;
   3. sulle voci di Lunr già presenti, quelle dello stesso codice/legge
      passano davanti al resto (Lunr non ha un concetto di "stesso
      codice"), e i doppioni delle card nostre vengono tolti.
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
  // Quante varianti dello stesso numero (bis, ter, ...) mostrare al
  // massimo come card "correlate": il Codice Penale arriva a decies,
  // qualche articolo di altre leggi ne ha più di una manciata.
  var LIMITE_CORRELATI = 8;
  var ORDINE_SUFFISSI = SUFFISSI.split("|");

  // Posizione di una chiave dell'indice ("133", "133-bis", ...) nell'ordine
  // legale dei suffissi: prima il numero nudo, poi bis, ter, quater...
  function ordineSuffisso(chiave) {
    var suffisso = chiave.split("-").slice(1).join("-");
    if (!suffisso) { return -1; }
    var i = ORDINE_SUFFISSI.indexOf(suffisso);
    return i === -1 ? ORDINE_SUFFISSI.length : i;
  }

  // Le altre varianti dello stesso numero (bis/ter/... di "133 cp"),
  // lette DIRETTAMENTE dall'indice delle citazioni — non da Lunr. Bug
  // reale, diagnosticato con dati veri sul sito online: Material mostra
  // solo i primi 10 risultati di Lunr e ne aggiunge 4 alla volta solo
  // quando si scorre in fondo, e per "133 cp" il "133-bis" del Codice
  // Penale non è nemmeno tra i primi 14 (con le pagine-indice delle leggi
  // nuove, ancora più in basso). Il riordino sotto può spostare solo ciò
  // che è già nella pagina — quindi funzionava "non sempre e non subito",
  // solo quando per caso Lunr l'aveva già messo tra i risultati
  // visualizzati. L'indice le conosce tutte, sempre: nessuna dipendenza
  // dall'ordine né dal caricamento a blocchi di Lunr.
  function correlati(indice, riconosciuta, sigla) {
    var voci = (indice && indice.articoli && indice.articoli[sigla]) || {};
    var chiaveEsatta = riconosciuta.suffisso
      ? riconosciuta.numero + "-" + riconosciuta.suffisso
      : riconosciuta.numero;
    return Object.keys(voci)
      .filter(function (k) { return k !== chiaveEsatta && k.split("-")[0] === riconosciuta.numero; })
      .sort(function (a, b) { return ordineSuffisso(a) - ordineSuffisso(b); })
      .slice(0, LIMITE_CORRELATI)
      .map(function (k) { return { chiave: k, record: voci[k] }; });
  }

  // Una card nostra (esatta o correlata): stessa struttura di un
  // risultato di Material, costruita col DOM — nessun testo dell'indice
  // finisce mai dentro una stringa HTML.
  function creaCard(record, numeroVisibile, classe, chiaveRichiesta, radice) {
    var li = document.createElement("li");
    li.className = "md-search-result__item ns-search-nostro " + classe;
    li.dataset.nsChiave = chiaveRichiesta;

    var a = document.createElement("a");
    a.className = "md-search-result__link";
    a.tabIndex = -1;
    a.href = radice ? new URL(record.url, radice).href : record.url;

    var article = document.createElement("article");
    // 'md-typeset' dà il carattere normale dei risultati di Lunr (16px,
    // peso 400) — alle sole card correlate: quella esatta resta più
    // grande e marcata di proposito, è il risultato che si cerca.
    article.className = "md-search-result__article"
      + (classe === "ns-search-correlato" ? " md-typeset" : "");
    var fonte = document.createElement("div");
    fonte.className = "ns-search-fonte";
    fonte.textContent = record.fonte;
    var h1 = document.createElement("h1");
    var numero = document.createElement("span");
    numero.className = "ns-search-numero";
    numero.textContent = numeroVisibile;
    h1.appendChild(numero);
    if (record.rubrica) {
      h1.appendChild(document.createTextNode(" - " + record.rubrica));
    }
    article.appendChild(fonte);
    article.appendChild(h1);
    a.appendChild(article);
    li.appendChild(a);
    return li;
  }

  pronto(function () {
    var input = document.querySelector('input[name="query"], input.md-search__input');
    var lista = document.querySelector(".md-search-result__list");
    if (!input || !lista) { return; }
    var radice = radiceSito();

    function voci() {
      return Array.prototype.slice.call(lista.children)
        .filter(function (li) { return !li.classList.contains("ns-search-nostro"); });
    }

    function rimuoviNostre() {
      Array.prototype.slice.call(lista.querySelectorAll(".ns-search-nostro"))
        .forEach(function (li) { li.remove(); });
    }

    // Tiene solo le prime LIMITE_RISULTATI voci della lista di Lunr (le
    // card nostre non contano contro il limite: restano sempre
    // visibili) — richiesto dall'utente: anche 75 risultati, figuriamoci
    // "1.4k", non si leggono comunque mai per intero. Operazione che
    // rimuove soltanto: una volta troncata, richiamarla di nuovo con la
    // stessa lista non tocca più nulla (nessun ciclo con l'observer).
    function tronca() {
      var lunr = voci();
      for (var i = LIMITE_RISULTATI; i < lunr.length; i++) {
        lunr[i].remove();
      }
    }

    // Sulle voci di Lunr GIÀ PRESENTI nella pagina (vedi correlati() per
    // il limite): toglie i doppioni delle card nostre — lo stesso
    // articolo mostrato due volte non aggiungerebbe nulla — e porta in
    // cima le voci dello stesso codice/legge, prima del resto. Richiesto
    // dall'utente: Lunr non ha alcun concetto di "stesso codice", quindi
    // lascia per esempio articoli del Codice Civile (che combaciano solo
    // per il numero) davanti ad altri articoli del Codice Penale.
    function riordina(indice, sigla) {
      var vociCodice = (indice && indice.articoli && indice.articoli[sigla]) || {};
      var slugDelCodice = {};
      Object.keys(vociCodice).forEach(function (chiave) {
        slugDelCodice[slugDaUrl(vociCodice[chiave].url)] = true;
      });
      var slugNostri = Array.prototype.slice
        .call(lista.querySelectorAll(".ns-search-nostro a.md-search-result__link"))
        .map(function (a) { return slugDaUrl(a.href); });

      var stessoCodice = [], altro = [];
      voci().forEach(function (li) {
        var link = li.querySelector("a.md-search-result__link");
        var slug = link ? slugDaUrl(link.href) : null;
        if (slug && slugNostri.indexOf(slug) !== -1) { li.remove(); return; }
        if (slug && slugDelCodice[slug]) { stessoCodice.push(li); }
        else { altro.push(li); }
      });

      var ordineDesiderato = stessoCodice.concat(altro);
      var attuali = voci();
      var giaAPosto = attuali.length === ordineDesiderato.length
        && attuali.every(function (li, i) { return li === ordineDesiderato[i]; });
      if (giaAPosto) { return; }

      ordineDesiderato.forEach(function (li) { lista.appendChild(li); });
    }

    function aggiorna() {
      var riconosciuta = riconosci(input.value);

      if (!riconosciuta) {
        rimuoviNostre();
        tronca();
        return;
      }

      // Riordino e troncamento agiscono SUBITO, in modo sincrono, se
      // l'indice è già arrivato (anche da una query precedente) — non
      // hanno bisogno di aspettare la fetch qui sotto, che serve solo
      // per (ri)mettere a posto le card nostre. Il riordino va fatto
      // PRIMA del troncamento: una voce da promuovere in cima deve
      // sopravvivere al taglio, non sparire perché era oltre il limite
      // nell'ordine originale di Lunr.
      var sigla = indiceRisolto ? indiceRisolto.alias[riconosciuta.alias] : null;
      if (sigla) { riordina(indiceRisolto, sigla); }
      tronca();

      // Chiave di confronto: se le card in cima corrispondono già a
      // questa identica citazione, il resto qui sotto (fetch + inserimento)
      // non serve più — evita anche un ciclo con il MutationObserver (il
      // nostro stesso inserimento è anch'esso una mutazione della lista,
      // che altrimenti farebbe ripartire questa funzione all'infinito).
      var chiaveRichiesta = riconosciuta.alias + "|" + riconosciuta.numero + "|" + riconosciuta.suffisso;
      var prima = lista.querySelector(".ns-search-nostro");
      if (prima && prima.dataset.nsChiave === chiaveRichiesta) {
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
        var siglaQuery = (stessa && indice) ? indice.alias[riconosciuta.alias] : null;
        var extra = siglaQuery ? correlati(indice, riconosciuta, siglaQuery) : [];

        rimuoviNostre();
        var carte = [];
        if (record) {
          var numeroVisibile = "Art. " + riconosciuta.numero
            + (riconosciuta.suffisso ? "-" + riconosciuta.suffisso : "");
          carte.push(creaCard(record, numeroVisibile, "ns-search-esatto", chiaveRichiesta, radice));
        }
        extra.forEach(function (c) {
          carte.push(creaCard(c.record, "Art. " + c.chiave, "ns-search-correlato", chiaveRichiesta, radice));
        });
        for (var i = carte.length - 1; i >= 0; i--) {
          lista.insertBefore(carte[i], lista.firstChild);
        }
      });
    }

    input.addEventListener("input", aggiorna);
    // Material ricostruisce la lista ad ogni risultato che arriva dal
    // worker di Lunr (stesso motivo per cui ricerca.js osserva la lista
    // con un MutationObserver, non basta elaborarla una volta) — se le
    // nostre card erano presenti, la ricostruzione le butta via insieme
    // al resto: vanno rimesse dopo ogni giro, non solo alla digitazione.
    new MutationObserver(aggiorna).observe(lista, { childList: true });
  });
})();
