const mongoose = require("mongoose"); 

const schema = new mongoose.Schema({
    _id : {type:String},
    inserzionista : {type:String, required : true},
    titolo : {type:String, maxLength: 30, required: true},
    descrizione : {type:String, maxLength: 350},
    dataPubblicazione : {type:String, required: true},
    modalitaTransazione : {type:String, required: true},
    prezzo : {type:Number},
    categoria : {type:String, required: true},
    indirizzoRitiro: {type:Object},
    pagamentoOnline: {type:Boolean, default:false},
    contoPayPal: {type:String},
    visibile: {type:Boolean,default:true},
    sponsorizzato : {type:Boolean,default:false}
});

const Annuncio = mongoose.model('Annuncio', schema); 

module.exports = Annuncio;