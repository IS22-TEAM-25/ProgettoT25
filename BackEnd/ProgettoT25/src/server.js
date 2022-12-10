//Importazioni
require('dotenv').config()

const express = require('express');
const app = express();

const util = require('util');

const cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
const routerUtente = require('./routes/utente');
app.use('/api/u', routerUtente);

const routerAnnuncio = require('./routes/annuncio');
app.use('/api/a', routerAnnuncio);

const routerLogin = require('./routes/authentication');
app.use('/api/l', routerLogin);

const routerTransazione = require('./routes/transazione');
app.use('/api/t', routerTransazione);

const routerRecensione = require('./routes/recensione');
app.use('/api/r', routerRecensione);

const routerProfio = require('./routes/profilo');
app.use('/api/p', routerProfio);


//Aggiungere FE
app.use('/', express.static(process.env.FRONTEND || '../static'));
app.use('/', express.static('../static'));

//Server UP
// process.env.PORT || 8080
//8081
const listener = app.listen(process.env.PORT || 8080, () =>
    console.log('Web server listening on port ' + listener.address().port),
);
