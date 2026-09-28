/* NormattivaStudio — tasto di segnalazione problemi, presente su ogni
   pagina (caricato via extra_javascript in mkdocs.yml, non solo su
   index.md). Invia in background a un modulo Google (che scrive su un
   Foglio Google, una riga per segnalazione) senza mai lasciare la
   pagina — 'mode: no-cors' è l'unico modo per farlo da un sito statico
   senza backend proprio: la risposta resta illeggibile da JS, quindi si
   assume che l'invio sia andato a buon fine se la richiesta di rete non
   fallisce (stesso limite di qualunque invio "silenzioso" verso Google
   Forms, non specifico di questo sito). */
(function () {
  function pronto(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  var FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSfgDx7RXL2m4hK4elZCXoJmZBd-BrBITshfWIEw4ZqQvdQQtw/formResponse";
  var CAMPO_PAGINA = "entry.1944609067";
  var CAMPO_DESCRIZIONE = "entry.823596228";

  var HTML_POPUP =
    '<div class="ns-segnala-popup" role="dialog" aria-label="Segnala un problema">' +
    '<h3>Segnala un problema</h3>' +
    '<p class="ns-segnala-hint">Descrivi brevemente cosa non va in questa pagina (facoltativo).</p>' +
    '<textarea class="ns-segnala-testo" rows="4" placeholder="Es. link rotto, testo mancante..."></textarea>' +
    '<div class="ns-segnala-azioni">' +
    '<button type="button" class="ns-btn ns-btn--secondario" data-azione="annulla">Annulla</button>' +
    '<button type="button" class="ns-btn ns-btn--primario" data-azione="invia">Invia</button>' +
    '</div>' +
    '</div>';

  pronto(function () {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ns-segnala-btn";
    btn.title = "Segnala un problema su questa pagina";
    btn.setAttribute("aria-label", "Segnala un problema su questa pagina");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>' +
      '<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' +
      '</svg>';

    var overlay = document.createElement("div");
    overlay.className = "ns-segnala-overlay";
    overlay.hidden = true;

    document.body.appendChild(btn);
    document.body.appendChild(overlay);

    function ripristinaPopup() {
      overlay.innerHTML = HTML_POPUP;
      overlay.querySelector('[data-azione="annulla"]').addEventListener("click", chiudi);
      overlay.querySelector('[data-azione="invia"]').addEventListener("click", invia);
    }

    function apri() {
      ripristinaPopup();
      overlay.hidden = false;
      overlay.querySelector(".ns-segnala-testo").focus();
    }

    function chiudi() {
      overlay.hidden = true;
    }

    function invia() {
      var testo = overlay.querySelector(".ns-segnala-testo").value.trim();
      var dati = new URLSearchParams();
      dati.set(CAMPO_PAGINA, window.location.href);
      dati.set(CAMPO_DESCRIZIONE, testo);

      fetch(FORM_ACTION, { method: "POST", mode: "no-cors", body: dati })
        .catch(function () { /* niente da leggere in no-cors: si prosegue comunque */ });

      overlay.querySelector(".ns-segnala-popup").innerHTML =
        '<p class="ns-segnala-grazie">Segnalazione inviata, grazie.</p>';
      setTimeout(chiudi, 1500);
    }

    btn.addEventListener("click", apri);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) { chiudi(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) { chiudi(); }
    });
  });
})();
