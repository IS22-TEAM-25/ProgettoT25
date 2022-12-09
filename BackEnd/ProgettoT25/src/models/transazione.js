const mongoose = require("mongoose"); 

const schema = new mongoose.Schema({
    _id : {type:String},
    //id creato concatendano alla data in ms
    //le prime lettere di venditore, acquirente e prodotto
    venditore: {type:String, required:true},
    acquirente: {type:String, required:true},
    prodotto: {type:String, required:true},
    pagamentoEffettuato: {type:Boolean, required:true, default:true},
    costo: {type:Number, required:true},
    dataTransazione: {type:Date, required:true},
    metodoTransazione : {type:String, required:true}
    //online o scambio di persona
});

const Transazione = mongoose.model('Transazione', schema); 

module.exports = Transazione;