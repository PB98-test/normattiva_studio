---
type: "Articolo di legge"
title: "Art. 15 - Formato dell’atto del procedimento in forma di documento informatico"
articolo: "Art. 15"
codice: dgsia24
aliases:
  - "art-15-dgsia24"
libro: null
libro_label: null
titolo: null
titolo_label: null
capo: "III"
capo_label: "TRASMISSIONE DI ATTI E DOCUMENTI INFORMATICI"
sezione: null
sezione_label: null
rubrica: "Formato dell’atto del procedimento in forma di documento informatico"
dataVigenza: "20261002"
fonte_ufficiale: "https://pst.giustizia.it/PST/resources/cms/documents/m_dg.DOG07.07082024.0004292.ID_SPECIFICHETECNICHE_DM_44_2011_FINALE_31_.pdf"
file_originale: "m_dg.DOG07.07082024.0004292.ID_SPECIFICHETECNICHE_DM_44_2011_FINALE_31_.pdf"
sha256_pdf: "eb08225f91aaf9900ed1b291b034cdfc2a98a0618a85fdc85828bdf6b195039b"
data_acquisizione: "2026-10-02"
conversione: "automatica da PDF (pdftotext); rimossi solo intestazioni/piè di pagina e numeri di pagina; testo non riassunto. Verificare sull'originale prima di citare."
ordine: 15
---

# Art. 15 - ***Formato dell’atto del procedimento in forma di documento informatico***

1\.     L’atto del procedimento civile o penale in forma di documento informatico, da depositare
telematicamente nell’ufficio giudiziario, deve rispettare i seguenti requisiti:
a)      è in formato PDF o PDF/A;
b)      è privo di elementi attivi;
c)      è ottenuto dalla trasformazione di un documento testuale, senza restrizioni per le operazioni
di selezione e copia di parti; non è pertanto ammessa la scansione di immagini;
d)      è sottoscritto con firma digitale o firma elettronica qualificata esterna secondo la struttura
riportata ai commi seguenti;
e)      è privo di protezione di password;
f)      nel procedimento civile è corredato da un file in formato XML, che contiene le informazioni
strutturate nonché tutte le informazioni della nota di iscrizione a ruolo, e che rispetta gli XSD riportati
nell’Allegato 5; esso è denominato DatiAtto.xml ed è sottoscritto con firma digitale o firma
elettronica qualificata.
g) nel procedimento penale per gli atti che le parti formano personalmente, se depositati come atto

principale, è consentita la scansione di documento analogico purché in bianco e nero e con una
risoluzione pari a 200 dpi.
2\.      La struttura del documento firmato è PAdES-BES (o PAdES Part 3) o CAdES-BES; il
certificato di firma è inserito nella busta crittografica; è fatto divieto di inserire nella busta
crittografica le informazioni di revoca riguardanti il certificato del firmatario. La modalità di

apposizione della firma digitale o della firma elettronica qualificata è del tipo “firme multiple
indipendenti” o parallele, e prevede che uno o più soggetti firmino, ognuno con la propria chiave
privata, lo stesso documento (o contenuto della busta). L’ordine di apposizione delle firme dei
firmatari non è significativo e un’alterazione dell’ordinamento delle firme non pregiudica la validità
della busta crittografica; nel caso del formato CAdES il file generato si presenta con un’unica
estensione p7m. Il meccanismo qui descritto è valido sia per l’apposizione di una firma singola che
per l’apposizione di firme multiple.
3\.     Le applicazioni di generazione della firma digitale o qualificata per la sottoscrizione dei
documenti informatici devono utilizzare la funzione di hash di cui all'articolo 4, comma 2, del decreto
del Presidente del Consiglio dei Ministri 22 febbraio 2013.
