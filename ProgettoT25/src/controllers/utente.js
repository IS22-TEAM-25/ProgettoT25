const aux = require("../auxiliaries/checks")

const User = require("../models/utente");

const saveNewUser = (req,res) => {
    User.findOne({email: req.body.email}, (err, data) => {
        if(!data){
            User.findOne({username: req.body.username}, (err, data) => {
                if(!data){
                    if(!aux.checkPw(req.body.password)){
                        return res.json({message: "Password non rispetta i requisiti!"});
                    }
                    
                    if(!aux.validateEmail(req.body.email)){
                        return res.json({message: "Email non valida!"});
                    }

                    const newUser = new User ({
                        nome : req.body.nome,
                        cognome : req.body.cognome,
                        datadinascita : req.body.datadinascita,
                        indirizzo : req.body.indirizzo,
                        email : req.body.email,
                        username : req.body.username,
                        password : req.body.password,
                        metodiPagamento : req.body.metodiPagamento,
                    });

                    newUser.save((err, data) => {
                        if (err) return res.json({Error: err});
                        return res.json(data);
                    })

                } else {
                    if (err) return res.json('Errore! ${err}');
                    return res.json({message: "Username già preso!"})
                }
            }) 
        } else {
            if (err) return res.json ('Errore! ${err}');
            return res.json({message:"Utente già presente con questa mail!"});
        }
    })
}

const deleteUserbyUsername = (req, res) => {
    User.findOne({username : req.params.username}, (err,data) => {
        if(!data){
            if(err) return res.json({Error: err});
            return res.json({message: "Utente non presente!"})
        } else {
            User.deleteOne({username: req.params.username});
        }
    })
}

const deleteUserbyEmail = (req, res) => {
    User.findOne({email : req.params.email}, (err,data) => {
        if(!data){
            if(err) return res.json({Error: err});
            return res.json({message: "Utente non presente!"})
        } else {
            User.deleteOne({email: req.params.email});
        }
    })
}

const getAll = (req,res) => {
    User.find({}, (err,data)=>{
        if(data){
            return res.json(data);
        } else {
            if (err) return res.json({Error: err});
            return res.json({message: "Nessun utente presente!"})
        }
    })
}

const getByUsername = (req,res) => {
    User.find({username : req.params.username}, (err,data) => {
        if(data){
            return res.json(data);
        } else {
            if(err) return res.json({Error: err});
            return res.json({message: "Utente non trovato!"})
        }
    })
}

const getByEmail = (req,res) => {
    User.find({email : req.params.email}, (err,data) => {
        if(data){
            return res.json(data);
        } else {
            if(err) return res.json({Error: err});
            return res.json({message: "Utente non trovato!"})
        }
    })
}

//export controller functions
module.exports = {
    saveNewUser,
    deleteUserbyUsername,
    deleteUserbyEmail,
    getAll,
    getByUsername,
    getByEmail
}
