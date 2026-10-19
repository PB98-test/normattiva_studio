---
type: "Articolo di legge"
title: "Art. 4 - Gestore della posta elettronica certificata del Ministero della giustizia"
articolo: "Art. 4"
codice: dgsia24
aliases:
  - "art-4-dgsia24"
libro: null
libro_label: null
titolo: null
titolo_label: null
capo: "II"
capo_label: "SISTEMI INFORMATICI DEL DOMINIO GIUSTIZIA"
sezione: null
sezione_label: null
rubrica: "Gestore della posta elettronica certificata del Ministero della giustizia"
dataVigenza: "20261002"
fonte_ufficiale: "https://pst.giustizia.it/PST/resources/cms/documents/m_dg.DOG07.07082024.0004292.ID_SPECIFICHETECNICHE_DM_44_2011_FINALE_31_.pdf"
file_originale: "m_dg.DOG07.07082024.0004292.ID_SPECIFICHETECNICHE_DM_44_2011_FINALE_31_.pdf"
sha256_pdf: "eb08225f91aaf9900ed1b291b034cdfc2a98a0618a85fdc85828bdf6b195039b"
data_acquisizione: "2026-10-02"
conversione: "automatica da PDF (pdftotext); rimossi solo intestazioni/piè di pagina e numeri di pagina; testo non riassunto. Verificare sull'originale prima di citare."
ordine: 4
---

# Art. 4 - ***Gestore della posta elettronica certificata del Ministero della giustizia***

1\.      Il Ministero della giustizia si avvale del proprio gestore di posta elettronica certificata, che
rilascia e gestisce apposite caselle di PEC degli uffici giudiziari e degli UNEP da utilizzare
esclusivamente per i servizi previsti dal Regolamento, nel rispetto delle specifiche tecniche riportate
nel presente provvedimento.

2\.     Le caselle appartengono ad apposito sottodominio (civile.ptel.giustiziacert.it e
penale.ptel.giustiziacert.it) e possono ricevere unicamente messaggi di posta elettronica certificata. I
messaggi di posta elettronica ordinaria vengono automaticamente scartati.
3\.      Il gestore dei servizi telematici utilizza i protocolli POP3S, IMAPS e SMTPS per collegarsi
al gestore di posta elettronica certificata del Ministero.
4\.     La codifica dei singoli uffici, comprensiva del relativo indirizzo di PEC, è contenuta nel
catalogo dei servizi telematici di cui all’articolo 5, comma 3.
5\.      Non possono essere utilizzate caselle di PEC diverse da quelle di cui ai commi precedenti per
la trasmissione e il deposito di atti processuali.
6\.      Il Ministero della giustizia conserva il log dei messaggi, pervenuti e transitati attraverso il
proprio gestore di posta elettronica certificata, per cinque anni. A tal fine, il gestore di PEC del
Ministero invia giornalmente, a una casella di posta di sistema, il log in formato CSV. Il file
contenente il log è protetto mediante tecniche crittografiche in grado di garantire la lettura del file al
solo Ministero della giustizia. Il log, sottoscritto con firma digitale o firma elettronica qualificata, è
relativo a tutti gli indirizzi del sottodominio delle caselle del processo telematico e contiene tutti gli
eventi relativi ai messaggi pervenuti e transitati, conservando le seguenti informazioni:
a)     il codice identificativo univoco assegnato al messaggio originale;
b)     la data e l’ora dell’evento;
c)     il mittente del messaggio originale;
d)     i destinatari del messaggio originale;
e)     l’oggetto del messaggio originale;
f)     il tipo di evento (accettazione, ricezione, consegna, emissione ricevute, errore, ecc.);
g)     il codice identificativo dei messaggi correlati generati (ricevute, errori, ecc.);
h)     il gestore mittente.
7\.     Un apposito modulo nell’ambito del PST comprende i componenti funzionali necessari per
l’acquisizione, il salvataggio e l’interrogazione dei log prodotti dal servizio di PEC.
8\.     I web service d’interrogazione dei log PEC sono disponibili ai sistemi interni al dominio
Giustizia.
9\.      Le comunicazioni di atti e documenti tra l’ufficio del pubblico ministero e gli ufficiali ed
agenti di polizia giudiziaria nella fase delle indagini preliminari, avvengono anche mediante i gestori
di posta elettronica certificata delle forze di polizia; in questo caso il gestore dei servizi telematici
utilizza un canale sicuro protetto da un meccanismo di crittografia mediante i protocolli POP3S o
HTTPS, al fine di evitare la trasmissione in chiaro delle credenziali di accesso e dei messaggi.
