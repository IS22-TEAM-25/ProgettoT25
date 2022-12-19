const express = require('express');

const multer = require('multer');
const upload = multer();

const routerUtente = express.Router();
const utenteController = require('../controllers/utente');

routerUtente.post('/signUp', upload.none(), utenteController.signUp);
routerUtente.delete('/deleteu/:username', utenteController.eliminaAccount);
routerUtente.get('/getAll', utenteController.findAllUsers);
routerUtente.get('/getu/:username', utenteController.getUserData);
routerUtente.patch('/updateu',upload.none(), utenteController.aggiornaDati);
routerUtente.patch('/updatee', upload.none(), utenteController.aggiornaEmail);
routerUtente.patch('/updatep', upload.none(), utenteController.aggiornaPassword);

module.exports = routerUtente;