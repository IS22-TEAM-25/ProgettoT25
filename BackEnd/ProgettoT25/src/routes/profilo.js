const express = require('express');

const multer = require('multer');
const upload = multer();

const routerProfilo = express.Router();
const profiloController = require('../controllers/profilo');

routerProfilo.post('/savep', upload.none(), profiloController.saveNewProfilo);
routerProfilo.get('/getAll', profiloController.getAll);
routerProfilo.get('/getp/:id', profiloController.getProfiloById);
routerProfilo.patch('/updatep', upload.none(), profiloController.modificaDescrizione);
routerProfilo.patch('/addwl', upload.none(), profiloController.aggiungiWl);
routerProfilo.patch('/rimuoviwl', upload.none(), profiloController.rimuoviWl);
routerProfilo.delete('/deletep/:id', profiloController.deleteProfilo);

module.exports = routerProfilo;