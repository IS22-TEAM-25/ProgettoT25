const express = require('express');

const multer = require('multer');
const upload = multer();

const routerRecensione = express.Router();
const recensioneController = require('../controllers/recensione');

routerRecensione.post('/saver', upload.none(),recensioneController.salvaRecensione);
routerRecensione.get('/getAll',recensioneController.findAllRecensioni);
routerRecensione.get('/getrv/:recensito', recensioneController.findRecensioniSuUnUtente);
routerRecensione.get('/getra/:recensore', recensioneController.findRecensioniDiUnUtente);
routerRecensione.get('/getrt/:transazione', recensioneController.findRecensioneTransazione);
routerRecensione.delete('/deleter/:id', recensioneController.eliminaRecensione);

module.exports = routerRecensione;

