---
type: "Indice normativo"
title: "NormattivaStudio"
---

<h1 class="ns-sr-only">NormattivaStudio</h1>

<div class="ns-home">

<h2 id="codici">Codici</h2>

<div class="doc-grid doc-grid--codici">
<a class="doc-card doc-card--penale" href="Codice%20Penale/00%20-%20Indice%20%28cp%29/" title="Codice Penale">CP</a>
<a class="doc-card doc-card--penale" href="Codice%20di%20Procedura%20Penale/00%20-%20Indice%20%28cpp%29/" title="Codice di Procedura Penale">CPP</a>
<a class="doc-card doc-card--civile" href="Codice%20Civile/00%20-%20Indice%20%28cc%29/" title="Codice Civile">CC</a>
<a class="doc-card doc-card--civile" href="Codice%20di%20Procedura%20Civile/00%20-%20Indice%20%28cpc%29/" title="Codice di Procedura Civile">CPC</a>
</div>

<div class="ns-altre-header">
  <h2 id="altre-leggi">Altre leggi</h2>
  <button type="button" class="ns-sort-btn" id="ns-ordina-anno" title="Inverti ordine per anno" aria-label="Inverti ordine per anno">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 9 12 4 17 9"/><polyline points="7 15 12 20 17 15"/></svg>
  </button>
</div>

<div class="doc-grid" id="ns-altre-leggi">
<a class="doc-card" data-anno="1990" href="L.%20353-1990%20-%2026.11.1990/00%20-%20Indice%20%28l353-90%29/">L. 353-1990 - 26.11.1990</a>
<a class="doc-card" data-anno="1990" href="TU%20Stupefacenti%20%28Dpr%20309-1990%20-%2009.10.1990%29/00%20-%20Indice%20%28dpr309-90%29/">TU Stupefacenti (Dpr 309-1990 - 09.10.1990)</a>
<a class="doc-card" data-anno="1992" href="CdS%20%28dlgs%20285-1992%20-%2030.04.1992%29/00%20-%20Indice%20%28dlgs285-92%29/">CdS (dlgs 285-1992 - 30.04.1992)</a>
<a class="doc-card" data-anno="1997" href="Legge%20254-1997%20-%2016.07.1997/00%20-%20Indice%20%28l254-97%29/">Legge 254-1997 - 16.07.1997</a>
<a class="doc-card" data-anno="1998" href="Dlgs%2051-1998%20-%2019.02.1998/00%20-%20Indice%20%28dlgs51-98%29/">Dlgs 51-1998 - 19.02.1998</a>
<a class="doc-card" data-anno="1998" href="L.%20188-1998%20-%2016.06.1998/00%20-%20Indice%20%28l188-98%29/">L. 188-1998 - 16.06.1998</a>
<a class="doc-card" data-anno="2005" href="Dl%2035-2005%20-%2014.03.2005/00%20-%20Indice%20%28dl35-05%29/">Dl 35-2005 - 14.03.2005</a>
<a class="doc-card" data-anno="2005" href="L.%2080-2005%20-%2014.05.2005/00%20-%20Indice%20%28l80-05%29/">L. 80-2005 - 14.05.2005</a>
<a class="doc-card" data-anno="2022" href="Cartabia%20%28Dlgs%20149-2022%20-%2010.10.2022%29/00%20-%20Indice%20%28dlgs149-22%29/">Cartabia (Dlgs 149-2022 - 10.10.2022)</a>
<a class="doc-card" data-anno="2022" href="L.%20197-2022%20-%2029.12.2022/00%20-%20Indice%20%28l197-22%29/">L. 197-2022 - 29.12.2022</a>
<a class="doc-card" data-anno="2024" href="Correttivo%20Cartabia%20%28Dlgs%20164-2024%20-%2031.10.2024%29/00%20-%20Indice%20%28dlgs164-24%29/">Correttivo Cartabia (Dlgs 164-2024 - 31.10.2024)</a>
</div>

</div>

<script>
(function () {
  var grid = document.getElementById("ns-altre-leggi");
  var btn = document.getElementById("ns-ordina-anno");
  if (!grid || !btn) { return; }
  var crescente = true;  // ordine iniziale generato dal server: per anno crescente
  btn.addEventListener("click", function () {
    crescente = !crescente;
    var caselle = Array.prototype.slice.call(grid.children);
    caselle.sort(function (a, b) {
      var da = parseInt(a.dataset.anno || "0", 10);
      var db = parseInt(b.dataset.anno || "0", 10);
      return crescente ? da - db : db - da;
    });
    caselle.forEach(function (c) { grid.appendChild(c); });
  });
})();
</script>
