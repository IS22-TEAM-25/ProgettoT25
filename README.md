# ProgettoT25-locale
Repository del progetto del team T25, impostata in modo da riuscire a eseguire il sistema sulla propria macchina.

# ISTRUZIONI PER ESEGUIRE IL SERVER
Dopo aver scaricato la repository, nella root del progetto è necessario eseguire il comando _npm install_ per scaricare tutto il codice dei moduli utilizzati.
Successivamente creare, sempre nella root, il file _.env_ con le variabili d'ambiente specificate nel documento **D4-T25**. È importante che siano presenti tutte per non avere problemi.

Infine eseguire il comando _npm start_ nella root del progetto per avviare il server.
Non appena verranno stampate a video le seguenti righe:

**Server in ascolto sulla porta: 8080**  
**MongoDB Connection -- Ready state is: 1**

la connessione al database sarà correttamente avvenuta e il server correttamente attivo.

Ora andando all'URL **http://localhost:8080/** si riuscirà a vedere la nostra webApp.

**N.B.!** Non è necessario avviare separatamente back-end e front-end perché abbiamo integrato il front-end, creato col framework Vuetify di Vue.js, con il server.
