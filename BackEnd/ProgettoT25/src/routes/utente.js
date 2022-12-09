const express = require('express');

const multer = require('multer');
const upload = multer();

const routerUtente = express.Router();
const utenteController = require('../controllers/utente');

routerUtente.post('/signUp', upload.none(), utenteController.saveNewUser);
routerUtente.delete('/deletee/:email', utenteController.deleteUserbyEmail);
routerUtente.delete('/deleteu/:username', utenteController.deleteUserbyUsername);
routerUtente.get('/getAll', utenteController.getAll);
routerUtente.get('/getu/:username', utenteController.getByUsername);
routerUtente.get('/gete/:email', utenteController.getByEmail);
routerUtente.patch('/updateu',upload.none(), utenteController.updateUser);
routerUtente.patch('/updatee', upload.none(), utenteController.updateEmail);
routerUtente.patch('/updatep', upload.none(), utenteController.updatePw);

module.exports = routerUtente;