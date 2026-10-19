---
type: "Articolo di legge"
title: "Art. 28 - Requisiti di sicurezza"
articolo: "Art. 28"
codice: dgsia24
aliases:
  - "art-28-dgsia24"
libro: null
libro_label: null
titolo: null
titolo_label: null
capo: "IV"
capo_label: "CONSULTAZIONE DELLE INFORMAZIONI DEL DOMINIO GIUSTIZIA"
sezione: null
sezione_label: null
rubrica: "Requisiti di sicurezza"
dataVigenza: "20261002"
fonte_ufficiale: "https://pst.giustizia.it/PST/resources/cms/documents/m_dg.DOG07.07082024.0004292.ID_SPECIFICHETECNICHE_DM_44_2011_FINALE_31_.pdf"
file_originale: "m_dg.DOG07.07082024.0004292.ID_SPECIFICHETECNICHE_DM_44_2011_FINALE_31_.pdf"
sha256_pdf: "eb08225f91aaf9900ed1b291b034cdfc2a98a0618a85fdc85828bdf6b195039b"
data_acquisizione: "2026-10-02"
conversione: "automatica da PDF (pdftotext); rimossi solo intestazioni/piè di pagina e numeri di pagina; testo non riassunto. Verificare sull'originale prima di citare."
ordine: 28
---

# Art. 28 - ***Requisiti di sicurezza***

1\.      L’architettura dei servizi di consultazione aderisce al modello MVC (Model View Controller)
e prevede il disaccoppiamento del front-end, localizzato sul punto di accesso o sul PST, dal back-end,
localizzato sul gestore dei servizi telematici, incaricato di esporre i servizi sottoforma di web service
(http/SOAP).

2\.      Il PST espone, attraverso un apposito servizio proxy, i web service forniti dal gestore dei
servizi telematici, a beneficio dei punti di accesso e di applicazioni esterne.
3\.      I punti di accesso realizzano autonomamente la parte di front-end, che deve essere localizzata
all’interno della intranet del PdA stesso e non deve essere accessibile direttamente dall’esterno.

4\.     I punti di accesso possono a loro volta esporre i web service forniti dal gestore dei servizi
telematici, a beneficio di applicazioni esterne.
5\.    Il protocollo di trasporto tra il punto di accesso e il proxy è HTTPS; la serializzazione dei
messaggi è nel formato XML/SOAP.
6\.     Le funzionalità fornite dai web service realizzati, nonché le relative regole di invocazione,
sono descritte tramite i WSDL pubblicati sull’area pubblica del PST.
7\.      L’accesso ai servizi di consultazione avviene su canale sicuro previa identificazione
informatica su di un PdA o sul PST, secondo le specifiche di cui all’articolo 6; a seguito di tale
identificazione, il PdA o il PST attribuiscono all’utente un ruolo di consultazione, a seconda del
registro di cancelleria; eseguita tale operazione, viene trasmesso al proxy di cui al comma 2 il codice
fiscale del soggetto che effettua l’accesso (nell’header http) e il ruolo di consultazione stesso (nel
messaggio SOAP); il proxy trasmette la richiesta al web service del gestore dei servizi telematici.
8\.      In base al ruolo di consultazione di cui al comma precedente, il sistema fornisce le
autorizzazioni all’accesso rispetto alle informazioni anagrafiche contenute nei sistemi di gestione dei
registri o sulla base dell’atto di delega previsto dal Regolamento.
9\.      In fase di richiesta di attivazione, il punto di accesso può adottare meccanismi di
identificazione basati sulla gestione federata delle identità digitali (modello GFID), secondo le
specifiche dell’Agenzia per l’Italia Digitale; in questo caso, il Direttore generale DGSIA, valutata la
soluzione proposta e opportunamente descritta nel piano della sicurezza, approva il meccanismo di
identificazione che soddisfa il livello di sicurezza richiesto.
10\.     Il punto di accesso può consentire l’accesso a soggetti delegati da un utente registrato
(soggetto delegante), con le stesse modalità di cui ai commi 7, 8 e 9, purché il soggetto delegante
abbia predisposto un atto di delega, sottoscritto con firma digitale, che il punto di accesso conserva
unitamente alla tracciatura di ogni accesso effettuato su delega; gli atti di conferimento e di revoca
della delega sono conservati per tre anni dalla data di cessazione della delega; le informazioni relative
agli accessi effettuati su delega sono conservate per cinque anni dalla data di esecuzione di ciascun
accesso; le informazioni e gli atti di cui sopra sono forniti su richiesta al Ministero della giustizia.
11\.     Fuori dai casi previsti ai commi 1 e 10, l’architettura dei servizi di consultazione prevede in
via residuale che il PdA o il PST effettuino, a seguito dell’identificazione di cui al comma 7, un link
diretto dalle proprie pagine alla pagina principale del sito web che rende disponibili i servizi su canale
sicuro (HTTPS); in questo caso i dati identificativi del soggetto vengono inseriti nell’header HTTP
della richiesta.
12\.    I servizi di consultazione attivi sono elencati, per singolo ufficio, nel catalogo dei servizi
telematici, di cui all’articolo 5, comma 3.
13\.    L’elenco dei PdA autorizzati è pubblicato nell’area pubblica del PST e nel catalogo dei servizi
telematici, di cui all’articolo 5, comma 3
14\.    Il PdA si dota di un piano della sicurezza, depositato al responsabile per i sistemi informativi
automatizzati unitamente all’istanza di iscrizione all’elenco pubblico dei punti di accesso, che
prevede la trattazione, esaustiva e dettagliata, dei seguenti argomenti:

a)     struttura logistica e operativa dell’organizzazione;
b)     ripartizione e definizione delle responsabilità del personale addetto;
c)     descrizione dei dispositivi installati;

d)      descrizione dell’infrastruttura di protezione, per ciascun immobile interessato (e rilevante ai
fini della sicurezza);
e)     descrizione delle procedure di registrazione delle utenze e delle procedure di conferimento e
revoca delle deleghe;
f)     descrizione relativa all’implementazione dei meccanismi di identificazione informatica;
g)     qualora il PdA integri la gestione delle caselle di PEC dei propri utenti, descrizione delle
modalità di integrazione;
h)     procedura di gestione delle copie di sicurezza dei dati;
i)     procedura di gestione dei disastri;
j)     analisi dei rischi e contromisure previste;
k)     descrizione dell’eventuale processo di delega di cui al comma 10 nonché delle modalità di
conservazione dell’elenco dei soggetti delegati e delle eventuali revoche delle deleghe;
l)     descrizione della modalità di verifica dell’effettiva funzionalità e adeguatezza del sistema di
sicurezza del punto di accesso.
15\.     Ai fini dell’iscrizione nel suddetto elenco, il responsabile per i sistemi informativi
automatizzati verifica il piano della sicurezza di cui al comma precedente e può disporre apposite
verifiche in loco, in particolare per accertare il rispetto delle prescrizioni di sicurezza riportate nel
presente provvedimento.
16\.    Il punto di accesso abilita i propri iscritti unicamente a usufruire dei servizi esplicitamente
autorizzati dal responsabile per i sistemi informativi automatizzati e riportati nel catalogo dei servizi
telematici.
17\.     Il PdA si dota di una casella di posta elettronica certificata, che comunica al responsabile per
i sistemi informativi automatizzati, da utilizzarsi per inviare e ricevere comunicazioni con il Ministero
della giustizia.
18\.     Il PdA fornisce al Ministero della giustizia, su richiesta, i dati di censimento sul ReGIndE di
cui articolo 8 comma 1 per i casi di iscrizione dei professionisti non iscritti in albi di cui articolo 9
comma 1.
19\.    Il PdA verifica l’effettiva funzionalità e adeguatezza del sistema di sicurezza almeno una volta
l’anno e provvede ad inviare l’esito delle stesse, unitamente ad eventuali variazioni nei contenuti del
piano, all’indirizzo di posta elettronica certificata del responsabile per i sistemi informativi
automatizzati: prot.dgsia.ddsc@giustiziacert.it.
