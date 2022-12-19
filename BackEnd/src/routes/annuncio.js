const express = require('express');

const multer = require('multer');
const upload = multer();

const routerAnnuncio = express.Router();
const annuncioController = require('../controllers/annuncio');

routerAnnuncio.post('/savea', upload.none(), annuncioController.salvaAnnuncio);
routerAnnuncio.get('/getAll',annuncioController.findAllArticles);
routerAnnuncio.get('/geti/:id',annuncioController.findById);
routerAnnuncio.get('/getau/:inserzionista',annuncioController.findByInserzionista);
routerAnnuncio.post('/getaf',upload.none(),annuncioController.findByFilters)
routerAnnuncio.delete('/deletea/:id',annuncioController.eliminaAnnuncio);
routerAnnuncio.patch('/updatea',upload.none(), annuncioController.modificaAnnuncio);
routerAnnuncio.get('/getkt/:word',annuncioController.findByKeyword);
routerAnnuncio.post('/ordina/:p',annuncioController.ordinaAnnunci);

module.exports = routerAnnuncio;