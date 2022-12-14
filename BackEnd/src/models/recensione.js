const mongoose = require("mongoose"); 

const schema = new mongoose.Schema({
    _id : {type:String},
    //id transazione per cui viene fatta
    utenteRecensito : {type:String, required:true},
    utenteRecensore : {type:String, required:true},
    transazioneRecensita : {type:String, required:true},
    stelle : {type:Number, minLength: 0, maxLength: 5, required:true},
    descrizione : {type:String, maxLength : 200, required:true},
    dataRecensione : {type:Date, required:true}
});

const Recensione = mongoose.model('Recensione', schema); 

module.exports = Recensione;