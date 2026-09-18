/* NormattivaStudio — navigazione rapida dentro un codice/legge: un
   breadcrumb in alto (Libro/Titolo/Capo/Sezione) e due link "articolo
   precedente/successivo" in fondo alla pagina. Nessun dato nuovo nel
   vault: entrambi derivati da cose che esistono già —
   - il breadcrumb dai nomi delle cartelle nell'URL stesso (già scritti
     in chiaro, con un prefisso numerico di ordinamento da togliere);
   - precedente/successivo scaricando la pagina-indice del codice/legge
     (che elenca già tutti gli articoli nell'ordine legale corretto) e
     cercando la posizione dell'articolo corrente in quell'elenco.
   Il link all'indice, per non dover indovinare il nome del file, è
   preso dal menu laterale stesso (stessa etichetta, stesso link che
   Material ha già generato). */
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

  function hrefNavPer(etichetta) {
    var link = Array.prototype.slice
      .call(document.querySelectorAll(".md-nav--primary .md-nav__link"))
      .find(function (a) { return a.textContent.trim() === etichetta; });
    return link ? link.getAttribute("href") : null;
  }

  pronto(function () {
    var h1 = document.querySelector(".md-content__inner > h1");
    if (!h1 || h1.classList.contains("ns-sr-only")) { return; }
    if (!/^Art\.\s/.test(h1.textContent)) { return; }  // solo pagine di articolo

    var radice = radiceSito();
    if (!radice) { return; }

    var rel = decodeURIComponent(location.pathname.slice(radice.pathname.length));
    var segmenti = rel.split("/").filter(Boolean);
    segmenti.pop();  // l'ultimo segmento è lo slug dell'articolo stesso
    if (!segmenti.length) { return; }

    var etichette = segmenti.map(function (seg) {
      return seg.replace(/^\d+\s*-\s*/, "");  // toglie il prefisso di ordinamento
    });

    // Segnalato dall'utente: il nome intero di Titolo/Capo/Sezione (con
    // la descrizione completa di Normattiva) rende il breadcrumb troppo
    // "voluminoso" — si ferma al numero/lettera che lo identifica
    // (es. "Titolo V", non "Titolo V - DELLA NON PUNIBILITÀ PER..."),
    // stessa regola per un eventuale segmento "Art. N" (oggi non capita
    // mai: l'articolo stesso è sempre l'ULTIMO segmento del percorso,
    // già escluso sopra da segmenti.pop() prima di arrivare qui — ma la
    // regola resta la stessa se un giorno cambiasse). Il nome per
    // esteso resta leggibile al passaggio del mouse (title), non è
    // perso, solo non più scritto per intero in pagina. Un segmento
    // che non segue nessuno di questi due schemi (es. il nome della
    // legge stessa, "TU Stupefacenti (Dpr 309-1990 - 09.10.1990)", che
    // ha un suo "-" dentro la data e si romperebbe tagliando al primo)
    // resta intero: nessuna regola generica "taglia al primo trattino".
    var RE_BREVE = /^((?:Libro|Titolo|Capo|Sezione)\s+[IVXLCDM\d]+|Art\.\s*\d+(?:-[a-z]+)?)\b/i;
    function etichettaBreve(testo) {
      var m = RE_BREVE.exec(testo);
      return m ? m[1] : testo;
    }

    // ── Breadcrumb ──
    var briciole = document.createElement("nav");
    briciole.className = "ns-briciole";
    briciole.setAttribute("aria-label", "Percorso");
    etichette.forEach(function (etichetta, i) {
      if (i > 0) {
        var sep = document.createElement("span");
        sep.className = "ns-briciole-sep";
        sep.textContent = "›";
        briciole.appendChild(sep);
      }
      var breve = etichettaBreve(etichetta);
      if (i === 0) {
        var href = hrefNavPer(etichetta);
        if (href) {
          var a = document.createElement("a");
          a.href = href;
          a.textContent = breve;
          if (breve !== etichetta) { a.title = etichetta; }
          briciole.appendChild(a);
          return;
        }
      }
      var span = document.createElement("span");
      span.textContent = breve;
      if (breve !== etichetta) { span.title = etichetta; }
      briciole.appendChild(span);
    });
    h1.parentNode.insertBefore(briciole, h1);

    // ── Precedente/successivo, dalla pagina-indice del codice/legge ──
    var hrefIndice = hrefNavPer(etichette[0]);
    if (!hrefIndice) { return; }
    var indiceUrl = new URL(hrefIndice, location.href);

    fetch(indiceUrl.href)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var contenuto = doc.querySelector(".md-content__inner");
        if (!contenuto) { return; }

        var links = Array.prototype.slice.call(contenuto.querySelectorAll("a[href]"));
        var quiPathname = location.pathname;
        var indice = links.findIndex(function (a) {
          try {
            return new URL(a.getAttribute("href"), indiceUrl).pathname === quiPathname;
          } catch (e) {
            return false;
          }
        });
        if (indice === -1) { return; }

        var prec = links[indice - 1];
        var succ = links[indice + 1];
        if (!prec && !succ) { return; }

        var piede = document.createElement("div");
        piede.className = "ns-art-nav";

        if (prec) {
          var aPrec = document.createElement("a");
          aPrec.className = "ns-art-nav__link ns-art-nav__link--prec";
          aPrec.href = new URL(prec.getAttribute("href"), indiceUrl).href;
          aPrec.textContent = "← " + prec.textContent.trim();
          piede.appendChild(aPrec);
        } else {
          piede.appendChild(document.createElement("span"));
        }

        if (succ) {
          var aSucc = document.createElement("a");
          aSucc.className = "ns-art-nav__link ns-art-nav__link--succ";
          aSucc.href = new URL(succ.getAttribute("href"), indiceUrl).href;
          aSucc.textContent = succ.textContent.trim() + " →";
          piede.appendChild(aSucc);
        } else {
          piede.appendChild(document.createElement("span"));
        }

        var contenitore = document.querySelector(".md-content__inner");
        contenitore.appendChild(piede);
      })
      .catch(function () { /* nessuna navigazione se il download fallisce */ });
  });
})();
