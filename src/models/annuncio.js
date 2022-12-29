const mongoose = require("mongoose"); 

const schema = new mongoose.Schema({
    _id : {type:String},
    inserzionista : {type:String, required : true},
    titolo : {type:String, maxLength: 30, required: true},
    descrizione : {type:String, maxLength: 350},
    dataPubblicazione : {type:Date, required: true},
    modalitaTransazione : {type:String, required: true},
    categoria : {type:String, required: true},
    indirizzoRitiro: {type:Object},
    pagamentoOnline: {type:Boolean, default:false},
    contoPayPal: {type:String},
    visibile: {type:Boolean,default:true},
    sponsorizzato : {type:Boolean,default:false},
    //per la vendita
    prezzo : {type:Number},
    //attributi per l'affitto
    prezzoAffittoAlGiorno : {type:Number},
    prezzoAffittoSettimanale : {type:Number},
    prezzoAffittoAllOra : {type:Number}
});

const Annuncio = mongoose.model('Annuncio', schema); 

module.exports = Annuncio;