const express = require('express');

const multer = require('multer');
const upload = multer();

const routerMail = express.Router();
const mailController = require('../controllers/mailSender');

routerMail.post('/sendEmail', upload.none(), mailController.inviaMail);
module.exports = routerMail;