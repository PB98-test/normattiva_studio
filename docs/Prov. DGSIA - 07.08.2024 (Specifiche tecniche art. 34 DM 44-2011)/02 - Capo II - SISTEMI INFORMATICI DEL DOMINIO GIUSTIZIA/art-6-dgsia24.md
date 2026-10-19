---
type: "Articolo di legge"
title: "Art. 6 - Identificazione informatica"
articolo: "Art. 6"
codice: dgsia24
aliases:
  - "art-6-dgsia24"
libro: null
libro_label: null
titolo: null
titolo_label: null
capo: "II"
capo_label: "SISTEMI INFORMATICI DEL DOMINIO GIUSTIZIA"
sezione: null
sezione_label: null
rubrica: "Identificazione informatica"
dataVigenza: "20261002"
fonte_ufficiale: "https://pst.giustizia.it/PST/resources/cms/documents/m_dg.DOG07.07082024.0004292.ID_SPECIFICHETECNICHE_DM_44_2011_FINALE_31_.pdf"
file_originale: "m_dg.DOG07.07082024.0004292.ID_SPECIFICHETECNICHE_DM_44_2011_FINALE_31_.pdf"
sha256_pdf: "eb08225f91aaf9900ed1b291b034cdfc2a98a0618a85fdc85828bdf6b195039b"
data_acquisizione: "2026-10-02"
conversione: "automatica da PDF (pdftotext); rimossi solo intestazioni/piè di pagina e numeri di pagina; testo non riassunto. Verificare sull'originale prima di citare."
ordine: 6
---

# Art. 6 - ***Identificazione informatica***

1\.       L’identificazione informatica per i soggetti abilitati esterni e gli utenti privati avviene sul PST
mediante carta nazionale dei servizi o SPID con livello di sicurezza almeno pari a 2 e sul punto di
accesso mediante autenticazione a due fattori oppure tramite token crittografico (smart card, chiavetta
USB o altro dispositivo sicuro) o SPID con livello di sicurezza almeno pari a 2, in conformità
all'articolo 64 del CAD; in caso si utilizzi il token crittografico, l’identificazione avviene nel rispetto
dei seguenti requisiti:
a)     Il certificato deve essere rilasciato da un certificatore accreditato dall’Agenzia per l’Italia
Digitale ai sensi dell'art 29 del CAD, che si fa garante dell’identità del soggetto;
b)     Il certificato deve rispettare il profilo del certificato previsto dalla Carta Nazionale dei Servizi
(CNS), facendo riferimento all’Appendice 1 del documento rilasciato dal CNIPA: “Linee guida per
l’emissione e l’utilizzo della Carta Nazionale dei Servizi”. L’estensione Certificate Policy (2.5.29.32)
può essere valorizzata con un Object Identifier (OID) definito dalla CA;
c)      In termini di sicurezza, i dispositivi ammessi sono i dispositivi personali consentiti per la firma
elettronica qualificata e quindi smart card e token USB, secondo quanto previsto dalla normativa
vigente. I dispositivi sicuri devono essere certificati Common Criteria EAL4+ con traguardo di
sicurezza o profilo di protezione conforme alle disposizioni comunitarie;

d)     In termini d’interoperabilità, sono ammissibili dispositivi che consentano la disponibilità di
entrambe le interfacce PKCS#11 e CSP; in particolare, entrambe le interfacce devono consentire
l’accesso alla procedura d’identificazione forte mediante digitazione del PIN da parte dell’utente; il
dispositivo deve inoltre rispettare la strutturazione del file system come da specifiche CNS.

2\.      In fase di identificazione tramite token crittografico, il punto di accesso o il PST verifica la
validità del certificato presente nel token crittografico utilizzato dall’utente che accede; prima di
consentire qualunque operazione, inoltre, il punto di accesso verifica che il token crittografico sia
collegato alla postazione; in caso contrario, invalida e termina la sessione.
3\.     Il Ministero della giustizia verifica, anche attraverso opportune visite ispettive, che i punti di
accesso rispettino i predetti requisiti.
4\.     La violazione delle regole di sicurezza di cui ai precedenti commi comporta per il punto di
accesso la sospensione dell’autorizzazione a erogare i servizi, fino al definitivo adeguamento ai
suddetti requisiti.
5\.     L’identificazione informatica per i soggetti abilitati interni avviene ai sensi dell’articolo 12.
