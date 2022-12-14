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
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument) );

//Database UP
const mongoose = require('mongoose');
// const Annuncio = require('./models/annuncio');
// const exp = require('constants');

// 'mongodb+srv://dbT25:1234dbT25@cluster0.uro2g9o.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(
    process.env.DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);

// Routes for Api
const tokenChecker = require('./src/controllers/tokenChecker')

const routerUtente = require('./src/routes/utente');
app.use('/api/u/deletee/:email', tokenChecker);
app.use('/api/u/deleteu/:username', tokenChecker);
app.use('/api/u/updateu', tokenChecker);
app.use('/api/u/updatee', tokenChecker);
app.use('/api/u/updatep', tokenChecker);
app.use('/api/u', routerUtente);

const routerAnnuncio = require('./src/routes/annuncio');
app.use('/api/a/savea', tokenChecker);
// app.use('/api/a/deletea/:id', tokenChecker);
app.use('/api/a/updatea', tokenChecker);
app.use('/api/a', routerAnnuncio);

const routerLogin = require('./src/routes/authentication');
app.use('/logout',tokenChecker);
app.use('/api/l', routerLogin);

const routerTransazione = require('./src/routes/transazione');
app.use('/api/t/getta/:acquirente', tokenChecker);
app.use('/api/t', routerTransazione);

const routerRecensione = require('./src/routes/recensione');
app.use('/api/r/saver',tokenChecker);
app.use('/api/r/deleter/:id',tokenChecker);
app.use('/api/r', routerRecensione);

const routerProfio = require('./src/routes/profilo');
app.use('/api/p/deletep/:id',tokenChecker);
// app.use('/api/p/updaterat',tokenChecker);
app.use('/api/p/updatep',tokenChecker);
app.use('/api/p/addwl',tokenChecker);
app.use('/api/p/rimuoviwl',tokenChecker);
// app.use('/api/p/updateao',tokenChecker);
// app.use('/api/p/updatesv',tokenChecker);
// app.use('/api/p/updatesa',tokenChecker);
// app.use('/api/p/updaterec',tokenChecker);

app.use('/api/p', routerProfio);

//Aggiungere FE
app.use('/', express.static(process.env.FRONTEND || './static'));
app.use('/', express.static('./static'));

//Server UP
// process.env.PORT || 8080
const listener = app.listen(process.env.PORT || 8080, () =>
    console.log('Web server listening on port ' + listener.address().port),
);
