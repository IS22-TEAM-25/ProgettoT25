const express = require('express');

const multer = require('multer');
const upload = multer();

const routerTransazione = express.Router();
const transazioneController = require('../controllers/transazione');

routerTransazione.post('/savet', upload.none(),transazioneController.salvaTransazione);
routerTransazione.get('/getAll',transazioneController.findAllTransazioni);
routerTransazione.get('/gettv/:venditore', transazioneController.findTransazioniVenditore);
routerTransazione.get('/getta/:acquirente', transazioneController.findTransazioniAcquirente);
routerTransazione.get('/gettp/:annuncio', transazioneController.findTransazioniProdotto);
routerTransazione.delete('/deletet/:id', transazioneController.eliminaTransazione);

module.exports = routerTransazione;

