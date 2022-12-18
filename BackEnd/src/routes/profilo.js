const express = require('express');

const multer = require('multer');
const upload = multer();

const routerProfilo = express.Router();
const profiloController = require('../controllers/profilo');

routerProfilo.post('/savep', upload.none(), profiloController.saveNewProfilo);

routerProfilo.get('/getAll', profiloController.getAll);
routerProfilo.get('/getp/:id', profiloController.getProfiloById);
routerProfilo.get('/getbest/', profiloController.commuteBestUsers);

routerProfilo.delete('/deletep/:id', profiloController.deleteProfilo);

routerProfilo.patch('/updaterat',upload.none(),profiloController.updateRating);
routerProfilo.patch('/updatep', upload.none(), profiloController.modificaDescrizione);
routerProfilo.patch('/addwl', upload.none(), profiloController.aggiungiWl);
routerProfilo.patch('/rimuoviwl', upload.none(), profiloController.rimuoviWl);
routerProfilo.patch('/updateao', upload.none(), profiloController.updateAnnunciOnline);
routerProfilo.patch('/updatesv', upload.none(), profiloController.updateStatisticheVendita);
routerProfilo.patch('/updatesa',upload.none(),profiloController.updateStatisticheAcquisti);
module.exports = routerProfilo;