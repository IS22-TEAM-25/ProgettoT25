const express = require('express');

const multer = require('multer');
const upload = multer();

const routerAnnuncio = express.Router();
const annuncioController = require('../controllers/annuncio');

routerAnnuncio.post('/savea', upload.none(), annuncioController.saveNewAnnuncio);
routerAnnuncio.get('/getAll',annuncioController.getAll);
routerAnnuncio.get('/geti/:id',annuncioController.getById);
routerAnnuncio.get('/getau/:inserzionista',annuncioController.getByUser);
//routerAnnuncio.get('/getaf', upload.none(), annuncioController.getByFilters);
routerAnnuncio.post('/getaf',upload.none(),annuncioController.filtraggioSuArray)
routerAnnuncio.delete('/deletea/:id',annuncioController.deleteAnnuncioById);
routerAnnuncio.get('/ordina/:p', annuncioController.ordinaAnn);
routerAnnuncio.patch('/updatea',upload.none(), annuncioController.updateAnn);

module.exports = routerAnnuncio;