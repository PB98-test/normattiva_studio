// NormattivaStudio — service worker. Adattato da quello di OdG (stesso
// principio, sito diverso): un piccolo programma che il telefono tiene
// installato insieme al sito e che si mette "in mezzo" tra il sito e la
// rete. Deve stare alla RADICE del sito pubblicato (non sotto
// javascripts/, come gli altri script): un service worker controlla
// solo le pagine alla propria altezza o sotto, mai sopra — vedi
// genera_service_worker in pubblica_vault.py, che lo scrive qui e vi
// sostituisce i segnaposto __NS_...__ ad ogni pubblicazione.
//
// Diverso da OdG su un punto scelto apposta: qui NON si salva ogni
// pagina visitata (niente tetto di pagine da gestire, niente pulizia
// delle più vecchie) — solo un piccolo elenco fisso, deciso in
// anticipo (home + le note-indice dei 4 codici), scaricato e salvato
// SUBITO all'installazione, non "alla prima visita". Per un sito di
// riferimento normativo, mostrare senza saperlo un articolo non più
// aggiornato è un rischio reale, non solo un dato vecchio — restringere
// l'offline vero a un piccolo insieme scelto (non "tutto ciò che capita
// di aver visto") tiene quel rischio sotto controllo.
//
// Regole:
// - PAGINE (navigazione): prima la rete, sempre — mostra la versione
//   più recente ogni volta che c'è connessione. Senza rete: la pagina
//   precaricata se è una di quelle, altrimenti una vista minima "non
//   disponibile offline" (mai l'errore grezzo del browser).
// - FILE CON VERSIONE nell'indirizzo (?v=..., CSS/JS: cambia da solo
//   quando cambia il contenuto) e i due indici di ricerca pesanti
//   (search_index.json di Material, il nostro citazioni.json — nessuno
//   dei due ha un hash nel proprio nome, il primo perché generato da
//   codice di terze parti che non tocchiamo, il secondo per coerenza
//   con quello): dalla memoria se già presenti, così sono istantanei
//   anche con la rete presente — la freschezza qui non viene
//   dall'indirizzo ma dal fatto che TUTTA la cache si svuota da sola
//   ad ogni pubblicazione (vedi VERSIONE più sotto).
// - FILE SENZA VERSIONE (font, favicon): prima la rete, la cache solo
//   come riserva — un font "vecchio" non fa danno, ma non c'è modo di
//   sapere se è ancora quello giusto, quindi non ci si fida ciecamente.
// - Tutto il resto: lasciato al browser, il service worker non si
//   intromette.

const VERSIONE = "20260928093632";   // cambia ad ogni pubblicazione: la cache si ricostruisce da zero
const CACHE_FILE = `ns-${VERSIONE}-file`;
const CACHE_PAGINE = `ns-${VERSIONE}-pagine`;

const PAGINE_DA_PRECARICARE = ["./", "Codice%20Penale/00%20-%20Indice%20%28cp%29/", "Codice%20di%20Procedura%20Penale/00%20-%20Indice%20%28cpp%29/", "Codice%20Civile/00%20-%20Indice%20%28cc%29/", "Codice%20di%20Procedura%20Civile/00%20-%20Indice%20%28cpc%29/"];
const FILE_DA_PRECARICARE = ["stylesheets/normativa.css?v=7747d1de", "javascripts/segnalazioni.js?v=1d8dd674", "javascripts/articoli.js?v=bbea3eba", "javascripts/ricerca.js?v=2fd43db5", "javascripts/ricerca-citazioni.js?v=61770fe9", "javascripts/navigazione.js?v=772f77d9", "javascripts/interfaccia.js?v=cbc047e9", "javascripts/sw-registra.js?v=cc658d8a", "fonts/Jost-Variable.woff2", "assets/favicon.png"];

// search_index.json (Material) e citazioni.json (nostro): nessun hash
// nel nome, quindi cache-first solo perché tutta la cache si rinnova ad
// ogni pubblicazione — vedi il commento sopra su VERSIONE.
const FILE_PESANTI_SENZA_HASH = [/\/search\/search_index\.json$/, /\/assets\/citazioni\.json$/];
// Il foglio di stile e gli script COMPILATI di Material stesso (es.
// "assets/stylesheets/main.ec1eaa64.min.css") — l'hash che li rende
// immutabili sta nel NOME del file, non in "?v=..." come i nostri:
// stessa garanzia di sicurezza (contenuto diverso = nome diverso),
// forma diversa. Bug reale trovato provando dal vivo con la rete
// staccata per davvero: senza questa regola, questi due file non
// passavano da NESSUNA delle regole qui sotto, restavano affidati alla
// cache HTTP normale del browser (non alla nostra), e una pagina
// precaricata risultava aperta ma priva di stile appena la rete
// mancava. "/assets/" qui sotto, non "^/assets/": il sito pubblicato
// vive in una sottocartella di GitHub Pages, un ancoraggio all'inizio
// dell'indirizzo avrebbe funzionato solo in locale (dove non c'è
// nessuna sottocartella) e mai online — stesso errore già fatto e
// corretto altrove in questo progetto.
const FILE_TEMA_MATERIAL = [/\/assets\/(stylesheets|javascripts)\//];
const FILE_SENZA_VERSIONE = [/\.woff2?(\?|$)/, /favicon\.png(\?|$)/, /manifest\.webmanifest(\?|$)/];

self.addEventListener("install", evento => {
  evento.waitUntil((async () => {
    const cachePagine = await caches.open(CACHE_PAGINE);
    const cacheFile = await caches.open(CACHE_FILE);
    // Non con cache.addAll(): un solo indirizzo che risponde male
    // farebbe fallire l'INSTALLAZIONE INTERA (il service worker non
    // entrerebbe mai in funzione) — meglio salvare quello che si può,
    // silenziosamente, che perdere tutto per un singolo file.
    await Promise.all(PAGINE_DA_PRECARICARE.map(u => precaricaTollerante(cachePagine, u)));
    await Promise.all(FILE_DA_PRECARICARE.map(u => precaricaTollerante(cacheFile, u)));
  })());
  self.skipWaiting();   // la versione nuova entra subito in funzione
});

async function precaricaTollerante(cache, indirizzo) {
  try {
    const risposta = await fetch(indirizzo);
    if (risposta.ok) await cache.put(indirizzo, risposta);
  } catch (e) { /* niente di grave: quella singola voce resterà scaricabile dalla rete */ }
}

self.addEventListener("activate", evento => {
  evento.waitUntil((async () => {
    for (const nome of await caches.keys()) {
      if (![CACHE_FILE, CACHE_PAGINE].includes(nome)) await caches.delete(nome);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", evento => {
  const richiesta = evento.request;
  const url = new URL(richiesta.url);
  if (richiesta.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.endsWith("/sw.js")) return;   // mai intercettare se stesso

  if (url.searchParams.has("v") || FILE_PESANTI_SENZA_HASH.some(re => re.test(url.pathname))
      || FILE_TEMA_MATERIAL.some(re => re.test(url.pathname))) {
    evento.respondWith(daMemoriaOppureRete(richiesta, CACHE_FILE));
  } else if (FILE_SENZA_VERSIONE.some(re => re.test(url.pathname))) {
    evento.respondWith(daReteOppureMemoria(richiesta, CACHE_FILE));
  } else if (richiesta.mode === "navigate") {
    evento.respondWith(pagina(richiesta));
  }
});

async function daMemoriaOppureRete(richiesta, nomeCache) {
  const cache = await caches.open(nomeCache);
  const salvata = await cache.match(richiesta);
  if (salvata) return salvata;
  const risposta = await fetch(richiesta);
  if (risposta.ok) cache.put(richiesta, risposta.clone());
  return risposta;
}

async function daReteOppureMemoria(richiesta, nomeCache) {
  const cache = await caches.open(nomeCache);
  try {
    const risposta = await fetch(richiesta);
    if (risposta.ok) cache.put(richiesta, risposta.clone());
    return risposta;
  } catch (e) {
    return (await cache.match(richiesta)) || Response.error();
  }
}

async function pagina(richiesta) {
  try {
    return await fetch(richiesta);
  } catch (e) {
    const cache = await caches.open(CACHE_PAGINE);
    return (await cache.match(richiesta)) || vistaRiserva();
  }
}

// Mostrata SOLO quando manca la rete e la pagina richiesta non è tra le
// poche precaricate — mai per una pagina già vista altrimenti (quella
// arriva dalla riga sopra). Stesso linguaggio visivo del riquadro che
// sw-registra.js mostra in sovraimpressione sulle pagine già caricate
// (.ns-segnala-overlay/.ns-segnala-popup in normativa.css) — qui è
// un'intera pagina, non un riquadro sopra qualcosa, perché la
// navigazione non è mai arrivata a destinazione: non c'è nulla sotto
// da coprire.
function vistaRiserva() {
  const cssHref = new URL("stylesheets/normativa.css?v=7747d1de", self.location).href;
  const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pagina non disponibile offline — NormattivaStudio</title>
<link rel="stylesheet" href="${cssHref}">
<style>
  body { display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
</style>
</head>
<body>
  <div class="ns-segnala-popup" role="alert" style="max-width:420px;">
    <h3>Pagina non disponibile offline</h3>
    <p class="ns-segnala-hint">Questa pagina non è tra quelle salvate per l'uso senza rete (solo la home e gli indici dei codici lo sono). Riprova quando torni in connessione.</p>
    <div class="ns-segnala-azioni">
      <button type="button" class="ns-btn ns-btn--primario" onclick="location.reload()">Riprova</button>
    </div>
  </div>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

// ---------------------------------------------------------------------
// Niente notifiche push: a differenza di OdG (un'app con un server che
// decide quando avvisare di qualcosa), NormattivaStudio pubblicato è un
// sito statico — nessun evento server-side da notificare, e nessuna
// richiesta dell'utente in questo senso. Se un giorno servisse davvero,
// il posto giusto è il lettore custom (Blocco 3), che avrà un backend
// vero — non questo sito "leggero e temporaneo".
