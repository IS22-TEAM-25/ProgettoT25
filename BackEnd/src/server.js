//Importazioni
require('dotenv').config()

const express = require('express');
const app = express();

const util = require('util');

const cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Documentazione
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument) );

// Routes for Api
const tokenChecker = require('./controllers/tokenChecker')

const routerUtente = require('./routes/utente');
app.use('/api/u/deleteu/:username', tokenChecker);
app.use('/api/u/updateu', tokenChecker);
app.use('/api/u/updatee', tokenChecker);
app.use('/api/u/updatep', tokenChecker);
app.use('/api/u', routerUtente);

const routerLogin = require('./routes/authentication');
app.use('/logout',tokenChecker);
app.use('/api/l', routerLogin);

const routerAnnuncio = require('./routes/annuncio');
app.use('/api/a/savea', tokenChecker);
app.use('/api/a/updatea', tokenChecker);
app.use('/api/a', routerAnnuncio);

const routerTransazione = require('./routes/transazione');
app.use('/api/t/savet', tokenChecker);
app.use('/api/t/getta/:acquirente', tokenChecker);
app.use('/api/t/gettv/:venditore', tokenChecker);
app.use('/api/t', routerTransazione);

const routerRecensione = require('./routes/recensione');
app.use('/api/r/saver',tokenChecker);
app.use('/api/r/getra/:recensore',tokenChecker);
app.use('/api/r/deleter/:id',tokenChecker);
app.use('/api/r', routerRecensione);

const routerProfio = require('./routes/profilo');
app.use('/api/p/deletep/:id',tokenChecker);
app.use('/api/p/updatep',tokenChecker);
app.use('/api/p/addwl',tokenChecker);
app.use('/api/p/rimuoviwl',tokenChecker);

app.use('/api/p', routerProfio);

const routerMail = require('./routes/mailSender');
app.use('/api/m',routerMail);

module.exports = app;