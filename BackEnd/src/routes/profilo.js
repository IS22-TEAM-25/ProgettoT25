const express = require('express');

const multer = require('multer');
const upload = multer();

const routerProfilo = express.Router();
const profiloController = require('../controllers/profilo');

routerProfilo.post('/savep', upload.none(), profiloController.salvaProfilo);

routerProfilo.get('/getAll', profiloController.findAllProfiles);
routerProfilo.get('/getp/:id', profiloController.findById);
routerProfilo.get('/getbest/', profiloController.findBestProfiles);

routerProfilo.delete('/deletep/:id', profiloController.eliminaProfilo);

routerProfilo.patch('/updaterat',upload.none(),profiloController.aggiornaRating);
routerProfilo.patch('/updatep', upload.none(), profiloController.aggiornaDescrizione);
routerProfilo.patch('/addwl', upload.none(), profiloController.aggiungiWishList);
routerProfilo.patch('/rimuoviwl', upload.none(), profiloController.rimuoviWishList);
routerProfilo.patch('/updateao', upload.none(), profiloController.aggiornaAnnunciOnline);
routerProfilo.patch('/updatesv', upload.none(), profiloController.aggiornaStatisticheVendita);
routerProfilo.patch('/updatesa',upload.none(),profiloController.aggiornaStatisticheAcquisti);
module.exports = routerProfilo;