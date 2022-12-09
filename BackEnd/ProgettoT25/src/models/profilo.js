const mongoose = require("mongoose"); 

const schema = new mongoose.Schema({
    _id : {type:String},
    descrizioneProfilo : {type:String, maxLength : 250},
    dataCreazioneProfilo: {type:Date, required:true},
    rating : {type:Number, default : 0},
    guadagnoDagliAffitti : {type:Number, default : 0},
    guadagnoDalleVendite : {type:Number, default : 0},
    prodottiVenduti : {type:Number, default : 0},
    transazioniCompletate: {type:Number, default : 0},
    annunciOnlineVendita : {type:Number, default : 0},
    annunciOnlineAffitto : {type:Number, default : 0},
    whishList : {type:Array}
});

const Profilo = mongoose.model('Profilo', schema); 

module.exports = Profilo;