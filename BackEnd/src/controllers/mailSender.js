const nodemailer = require('nodemailer');
const User = require('../models/utente');
require('dotenv').config()

//pass: 'gpsltvgbizgswaaj'

//Nel body: indirizzo, subject e messaggio
//toAddress, subj, message
const inviaMail = function(req, res){
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDR,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailDetails = {
        from: process.env.EMAIL_ADDR,
        to: req.body.toAddress,
        subject: req.body.subj,
        text: req.body.message
    };

    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error with mail! ' + err);
            return res.status(500).json({success: false, Error: err})
        } else {
            console.log('All good');
            return res.status(204).send();
        }
    });
}

module.exports = {inviaMail};

//PER RIPRISTINO PW
// Hai effettuato la richiesta di ripristino password. Ecco una password per accedere al tuo account:
// ***
// Ti consigliamo di cambiarla dalle impostazioni del profilo.
// Il team di SpottyThings.

//Richiesta ripristino password

//PER CONFERMA ACQUISTO
// Hai effettuato l'acquisto del prodotto 'Titolo' di 'Inserzionista'.
// Il team di SpottyThings.

//Conferma ordine 'Titolo Ordine'

//PER CONFERMA VENDITA
// Congratulazioni! 'Utente' ha effettuato l'acquisto del tuo prodotto 'Titolo'.
// Il team di SpottyThings.

//Conferma vendita 'Titolo Ordine'

