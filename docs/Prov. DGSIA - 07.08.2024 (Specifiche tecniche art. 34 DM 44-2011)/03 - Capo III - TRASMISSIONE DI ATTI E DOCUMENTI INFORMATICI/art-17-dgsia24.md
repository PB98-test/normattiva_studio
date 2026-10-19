---
type: "Articolo di legge"
title: "Art. 17 - Trasmissione di atti da parte dei soggetti abilitati esterni nel procedimento civile"
articolo: "Art. 17"
codice: dgsia24
aliases:
  - "art-17-dgsia24"
libro: null
libro_label: null
titolo: null
titolo_label: null
capo: "III"
capo_label: "TRASMISSIONE DI ATTI E DOCUMENTI INFORMATICI"
sezione: null
sezione_label: null
rubrica: "Trasmissione di atti da parte dei soggetti abilitati esterni nel procedimento civile"
dataVigenza: "20261002"
fonte_ufficiale: "https://pst.giustizia.it/PST/resources/cms/documents/m_dg.DOG07.07082024.0004292.ID_SPECIFICHETECNICHE_DM_44_2011_FINALE_31_.pdf"
file_originale: "m_dg.DOG07.07082024.0004292.ID_SPECIFICHETECNICHE_DM_44_2011_FINALE_31_.pdf"
sha256_pdf: "eb08225f91aaf9900ed1b291b034cdfc2a98a0618a85fdc85828bdf6b195039b"
data_acquisizione: "2026-10-02"
conversione: "automatica da PDF (pdftotext); rimossi solo intestazioni/piè di pagina e numeri di pagina; testo non riassunto. Verificare sull'originale prima di citare."
ordine: 17
---

# Art. 17 - ***Trasmissione di atti da parte dei soggetti abilitati esterni nel procedimento civile***

1\.       Nel procedimento civile l’atto in forma di documento informatico e gli allegati di cui
all’articolo 16, sono trasmessi dai soggetti abitati esterni mediante la posta elettronica certificata di

cui al d.p.r. 11 febbraio 2005, n. 68.
2\.      L’atto e gli allegati sono contenuti nella cosiddetta “busta telematica”, ossia un file in formato
MIME che riporta tutti i dati necessari per l’elaborazione da parte del sistema ricevente (gestore dei
servizi telematici); in particolare la busta contiene il file Atto.enc, ottenuto dalla cifratura del file
Atto.msg, il quale contiene a sua volta:
a)     IndiceBusta.xml: il DTD è riportato nell’Allegato 4. Tale file deve essere omesso qualora il
suo contenuto sia presente nella sezione apposita del file DatiAtto.xml, come da XSD di cui al
successivo punto b).;
b)      DatiAtto.xml: gli XSD sono riportati nell’Allegato 5;
c)      <nome file (libero)>: atto vero e proprio, in formato PDF o PDF/A, sottoscritto con firma
digitale o firma elettronica qualificata secondo la struttura dell’articolo 15 comma 2;
d)      AllegatoX.xxx: uno o più allegati nei formati di file di cui all’articolo 16, eventualmente
sottoscritti con firma digitale o firma elettronica qualificata; il nome del file può essere scelto
liberamente.
3\.      La cifratura di Atto.msg è eseguita con la chiave di sessione (ChiaveSessione) cifrata con il
certificato del destinatario; IssuerDname è il Distinguished Name della CA che ha emesso il
certificato dell’ufficio giudiziario o dell’UNEP destinatario, SerialNumber è il numero seriale del
certificato dell’ufficio giudiziario o dell’UNEP destinatario; l’operazione di cifratura simmetrica del
file è effettuato con algoritmo di cifratura dedicato e le chiavi simmetriche di sessione sono cifrate
utilizzando la chiave pubblica contenuta nel certificato del destinatario; le chiavi di cifratura degli
uffici giudiziari sono disponibili nell’area pubblica del PST (il relativo percorso e nome file è indicato
nel catalogo dei servizi telematici).
4\.      La dimensione massima consentita per la busta telematica è pari a 60 Megabyte.
5\.     La busta telematica viene trasmessa all’ufficio giudiziario destinatario in allegato ad un
messaggio di posta elettronica certificata che rispetta le specifiche su mittente, destinatario, oggetto,
corpo e allegati come riportate nell’Allegato 6.
6\.      Il gestore dei servizi telematici scarica il messaggio dal gestore della posta elettronica
certificata del Ministero della giustizia ed effettua le verifiche formali sul messaggio; le eccezioni
gestite sono le seguenti:
a)      T001: l’indirizzo del mittente non è censito in ReGIndE;
b)      T002: Il formato del messaggio non è aderente alle specifiche;
c)      T003: la dimensione del messaggio eccede la dimensione massima consentita.
7\.      Il gestore dei servizi telematici, nel caso in cui il mittente sia un avvocato, effettua
l’operazione di certificazione, ossia recupera lo status del difensore da ReGIndE; nel caso in cui lo
status non sia “attivo”, viene segnalato alla cancelleria.
8\.     Il gestore dei servizi telematici effettua i controlli automatici sulla busta telematica; le possibili
anomalie all’esito dell’elaborazione della busta telematica sono codificate secondo le seguenti

tipologie:
a) WARN (WARNING): anomalia non bloccante; si tratta in sostanza di segnalazioni, tipicamente di
carattere giuridico (ad esempio manca la procura alle liti allegata all’atto introduttivo certificato di
firma non valido o mittente non firmatario dell’atto);

b) ERROR: anomalia bloccante che si verifica in tutti i casi nei quali è necessario un intervento della
cancelleria al fine di consentire l’accettazione dell’atto;
c) FATAL: anomalia bloccante, eccezione non gestita o non gestibile (esempio: impossibile decifrare
la busta depositata o elementi della busta mancanti ma fondamentali per l’elaborazione).
9\.      A seguito dell’invio dell’atto processuale i sistemi informativi ministeriali procedono alla
verifica e alla accettazione automatica del deposito degli atti inviati, salvi i casi di anomalia ovvero
quelli in cui è necessario l’intervento degli operatori di cancelleria.
10\.     In caso di anomalia bloccante (FATAL) il gestore dei servizi telematici invia al depositante
un messaggio di posta elettronica certificata, contenente la comunicazione del rifiuto
dell’accettazione dell’atto.
11\.     In caso di accettazione dell’atto, anche dopo l’intervento degli operatori di cancelleria, il
gestore dei servizi telematici invia al depositante un messaggio di posta elettronica certificata,
contenente la comunicazione dell’avvenuto deposito dell’atto, con effetto a decorrere dal momento
in cui è stata generata la ricevuta di accettazione da parte del gestore di posta elettronica certificata
del depositante, ai sensi dell’articolo 6, comma 1, del d.p.r. 11 febbraio 2005, n. 68.
12\.    La busta telematica è conservata nel sistema documentale di cui all’articolo 14, comma 2.
