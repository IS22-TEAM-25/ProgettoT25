const aux = require("../auxiliaries/checks")

const User = require("../models/utente");

//Creare automaticamente profilo dopo la registrazione!

const signUp = (req,res) => {
    User.findOne({email: req.body.email}, (err, data) => {
        if(!data){
            User.findOne({username: req.body.username}, (err, data) => {
                if(!data){

                    const objd = new Date(req.body.datadinascita);

                    const newUser = new User ({
                        _id : req.body.username,
                        nome : req.body.nome,
                        cognome : req.body.cognome,
                        datadinascita : objd,
                        indirizzo : req.body.indirizzo,
                        email : req.body.email,
                        username : req.body.username,
                        password : req.body.password,
                        metodiPagamento : req.body.metodiPagamento,
                    });

                    newUser.save((err, data) => {
                        if (err) return res.status(500).json({Error: err});
                        return res.status(201).json(data);
                    })

                } else {
                    if (err) return res.json({Error: err});
                    return res.status(409).json({success : false, message: "Username già preso!"})
                }
            }) 
        } else {
            if (err) return res.status(500).json ({Error: err});
            return res.status(409).json({success : false, message:"Utente già presente con questa mail!"});
        }
    })
}


const eliminaAccount = async (req, res) => {

    let data = await User.findOne({username : req.params.username}).exec();

    if(!data){
        return res.status(404).json({success: false, message: "Utente non presente!"})
    } else {
        await User.deleteOne({username: req.params.username});
        return res.status(204).send();
    }

}

const findAllUsers = (req,res) => {
    User.find({}, (err,data)=>{
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message: "Nessun utente presente!"})
            }
            return res.status(200).json(data);
        } else {
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun utente presente!"})
        }
    })
}

const getUserData = (req,res) => {
    User.findOne({username : req.params.username}, (err,data) => {
        if(data){
            return res.status(200).json(data);
        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Utente non trovato!"})
        }
    })
}

const aggiornaDati = (req, res) => {

    User.findOne({username : req.body.username}, (err, data) => {
        if(!data){
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Utente non trovato"})
        } else {

            User.updateOne({username : req.body.username},
                { $set: {
                    nome: req.body.nome,
                    cognome: req.body.cognome,
                    datadinascita : req.body.datadinascita,
                    indirizzo : req.body.indirizzo,
                    metodiPagamento : req.body.metodiPagamento
                }}, (err, data) => {
                if(err) return res.status(500).json({Error: err});
                return res.status(204).send();
            })
        }
    })
}

const aggiornaEmail = (req, res) => {

    User.findOne({username : req.body.username}, (err, data) => {
        if(!data){
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Utente non trovato"});
        } else if(data.email == req.body.email){
            return res.status(200).json({success: true, message : "Niente da modificare"});
        } else {
            User.findOne({email : req.body.email}, (err, data) => {
                if(data){
                    return res.status(409).json({success: false, message : "Email già usata"});
                } else {
                    if(err) return res.status(500).json({Error: err});
                    User.updateOne({username : req.body.username},
                        { $set: {
                            email: req.body.email,
                        }}, (err, data) => {
                        if(err) return res.status(500).json({Error: err});
                        return res.status(204).send();
                    })
                }
            })
        }
    });

}

const aggiornaPassword = (req, res) => {
    User.findOne({username : req.body.username}, (err, data) => {
        if(!data){
            return res.status(404).json({success: false, message : "Utente non trovato"});
        } else {
            if(err) return res.status(500).json({Error: err});

            User.updateOne({username : req.body.username},
                { $set: {
                    password: req.body.password,
                }}, (err, data) => {
                if(err) return res.status(500).json({Error: err});
                return res.status(204).send();
            })

        }
    })
}

//export controller functions
module.exports = {
    signUp,
    eliminaAccount,
    findAllUsers,
    getUserData,
    aggiornaDati,
    aggiornaEmail,
    aggiornaPassword
}
