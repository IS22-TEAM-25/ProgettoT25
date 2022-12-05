const mongoose = require("mongoose"); 

const schema = new mongoose.Schema({
    nome: {type:String, required:true},
    cognome: {type:String, required:true},
    datadinascita: {type:Date, required:true},
    indirizzo: {type:String, required:true},
    email: {type:String, required:true},
    username: {type:String, required:true, uniqueitem:true},
    password: {type:String, required:true, uniqueitem:true},
    metodiPagamento: {type:String},
    bloccato: {type:Boolean, default: false}
});

const User = mongoose.model('User', schema); 

module.exports = User;