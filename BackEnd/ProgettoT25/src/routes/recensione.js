const express = require('express');

const multer = require('multer');
const upload = multer();

const routerRecensione = express.Router();
const recensioneController = require('../controllers/recensione');

routerRecensione.post('/saver', upload.none(),recensioneController.saveNewRecensione);
routerRecensione.get('/getAll',recensioneController.getAll);
routerRecensione.get('/getrv/:recensito', recensioneController.getRecensito);
routerRecensione.get('/getra/:recensore', recensioneController.getRecensore);
routerRecensione.get('/getrt/:transazione', recensioneController.getTransazione);
routerRecensione.delete('/deleter/:id', recensioneController.deleteRecensioneById);

module.exports = routerRecensione;

