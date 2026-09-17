/* NormattivaStudio — riformatta il titolo degli articoli SOLO sul sito
   pubblicato, senza toccare il motore di conversione (motore_custom.py)
   né il vault sorgente: quel motore scrive "Art. N - ***Rubrica***"
   (grassetto+corsivo, tutto su una riga) fin dalla primissima versione,
   pensato per la lettura diretta del file .md — cambiarlo alla radice
   vorrebbe dire rigenerare l'intero vault e toccare anche Obsidian.
   Qui si riformatta solo il DOM già renderizzato: "Art. N" su una riga,
   la rubrica sotto, senza grassetto né corsivo — vedi .ns-art-rubrica
   in normativa.css.

   Selettore ristretto a '.md-content__inner > h1' (il titolo VERO della
   pagina, figlio diretto): un h1 identico per struttura compare anche
   dentro ai risultati di ricerca (article.md-search-result__article),
   che NON deve essere toccato. */
(function () {
  function pronto(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  pronto(function () {
    var h1 = document.querySelector(".md-content__inner > h1");
    if (!h1 || h1.classList.contains("ns-sr-only")) { return; }

    var testo = h1.textContent;
    if (!/^Art\.\s/.test(testo)) { return; }  // non è un titolo di articolo

    var idx = testo.lastIndexOf(" - ");
    if (idx === -1) { return; }  // "Art. NNN" senza rubrica, nulla da fare

    var numero = testo.slice(0, idx).trim();
    var rubrica = testo.slice(idx + 3).trim();

    h1.textContent = "";
    // "Art. N" nello stesso peso della rubrica (non grassetto): l'h1
    // di per sé è già in grassetto per via della regola generale sui
    // titoli in normativa.css, quindi va annullato esplicitamente qui,
    // non lasciato come testo semplice.
    var spanNumero = document.createElement("span");
    spanNumero.className = "ns-art-numero";
    spanNumero.textContent = numero;
    h1.appendChild(spanNumero);
    h1.appendChild(document.createElement("br"));
    var span = document.createElement("span");
    span.className = "ns-art-rubrica";
    span.textContent = rubrica;
    h1.appendChild(span);
  });
})();
