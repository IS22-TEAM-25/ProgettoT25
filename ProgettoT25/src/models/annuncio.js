const mongoose = require("mongoose"); 

const schema = new mongoose.Schema({
    _id : {type:String},
    inserzionista : {type:String, required : true},
    titolo : {type:String, required: true},
    descrizione : {type:String},
    modalitaTransazione : {type:String},
    categoria : {type:String},
    indirizzoRitiro: {type:String},
    pagamentoOnline: {type:Boolean},
    contoPayPal: {type:String},
    visibile: {type:Boolean,default:true},
    sponsorizzato : {type:Boolean,default:false}
});

const Annuncio = mongoose.model('Annuncio', schema); 

module.exports = Annuncio;