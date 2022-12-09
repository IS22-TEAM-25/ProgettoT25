const aux = require("../auxiliaries/checks")

const User = require("../models/utente");

const saveNewUser = (req,res) => {
    User.findOne({email: req.body.email}, (err, data) => {
        if(!data){
            User.findOne({username: req.body.username}, (err, data) => {
                if(!data){
                    if(!aux.checkPw(req.body.password)){
                        return res.status(400).json({success : false, message: "Password non rispetta i requisiti!"});
                    }
                    
                    if(!aux.validateEmail(req.body.email)){
                        return res.status(400).json({success : false, message: "Email non valida!"});
                    }

                    if(!aux.validateDate(req.body.datadinascita)){
                        return res.status(400).json({success : false, message: "DDN non valida!"});
                    }

                    const newUser = new User ({
                        _id : req.body.username,
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
                        if (err) return res.status(500).json({Error: err});
                        return res.status(201).json(data);
                    })

                } else {
                    if (err) return res.json('Errore! ${err}');
                    return res.status(409).json({success : false, message: "Username già preso!"})
                }
            }) 
        } else {
            if (err) return res.status(500).json ('Errore! ${err}');
            return res.status(409).json({success : false, message:"Utente già presente con questa mail!"});
        }
    })
}

const deleteUserbyUsername = async (req, res) => {

    let data = await User.findOne({username : req.params.username}).exec();

    if(!data){
        return res.status(404).json({success: false, message: "Utente non presente!"})
    } else {
        await User.deleteOne({username: req.params.username});
        return res.status(204).send();
    }

}

const deleteUserbyEmail = async (req, res) => {

    let data = await User.findOne({email : req.params.email}).exec();

    if(!data){
        return res.status(404).json({success: false, message: "Utente non presente!"})
    } else {
        await User.deleteOne({email: req.params.email});
        return res.status(204).send();
    }

}

const getAll = (req,res) => {
    User.find({}, (err,data)=>{
        if(data){
            return res.status(200).json(data);
        } else {
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun utente presente!"})
        }
    })
}

const getByUsername = (req,res) => {
    User.findOne({username : req.params.username}, (err,data) => {
        if(data){
            return res.status(200).json(data);
        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Utente non trovato!"})
        }
    })
}

const getByEmail = (req,res) => {
    User.findOne({email : req.params.email}, (err,data) => {
        if(data){
            return res.status(200).json(data);
        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Utente non trovato!"})
        }
    })
}

const updateUser = (req, res) => {

    User.findOne({username : req.body.username}, (err, data) => {
        if(!data){
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Utente non trovato"})
        } else {

            if(req.body.datadinascita){
                if(!aux.validateDate(req.body.datadinascita)){
                    return res.status(400).json({success : false, message: "DDN non valida!"});
                }
            }

            User.updateOne({username : req.body.username},
                { $set: {
                    nome: req.body.nome,
                    cognome: req.body.cognome,
                    datadinascita : req.body.datadinascita,
                    indirizzo : req.body.indirizzo,
                    metodiPagamento : req.body.metodiPagamento
                }}, (err, data) => {
                if(err) return res.status(500).json({Error: err});
                return res.status(200).json({success: true, message : "Dati correttamente aggiornati"});
            })
        }
    })
}

const updateEmail = (req, res) => {

    User.findOne({username : req.body.username}, (err, data) => {
        if(!data){
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Utente non trovato"});
        } else if(data.email == req.body.email){
            return res.status(200).json({success: true, message : "Niente da modificare"});
        } else if(!aux.validateEmail(req.body.email)){
            return res.status(404).json({success: false, message : "Email non valida"});
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
                        return res.status(200).json({success: true, message : "Email correttamente aggiornata"});
                    })
                }
            })
        }
    });

}

const updatePw = (req, res) => {
    User.findOne({username : req.body.username}, (err, data) => {
        if(!data){
            return res.status(404).json({success: false, message : "Utente non trovato"});
        } else {
            if(err) return res.status(500).json({Error: err});
            if(!aux.checkPw(req.body.password)){
                return res.status(400).json({success: false, message: "Password non valida"});
            }

            User.updateOne({username : req.body.username},
                { $set: {
                    password: req.body.password,
                }}, (err, data) => {
                if(err) return res.status(500).json({Error: err});
                return res.status(200).json({success: true, message : "Password correttamente aggiornata"});
            })

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
    getByEmail,
    updateUser,
    updateEmail,
    updatePw
}
