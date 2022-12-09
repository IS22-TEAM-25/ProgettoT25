const express = require('express');

const multer = require('multer');
const upload = multer();

const routerTransazione = express.Router();
const transazioneController = require('../controllers/transazione');

routerTransazione.post('/savet', upload.none(),transazioneController.saveNewTrans);
routerTransazione.get('/getAll',transazioneController.getAll);
routerTransazione.get('/gettv/:venditore', transazioneController.getVenditore);
routerTransazione.get('/getta/:acquirente', transazioneController.getAcquirente);
routerTransazione.get('/gettp/:annuncio', transazioneController.getAnnuncio);
routerTransazione.delete('/deletet/:id', transazioneController.deleteTransazioneById);

module.exports = routerTransazione;

