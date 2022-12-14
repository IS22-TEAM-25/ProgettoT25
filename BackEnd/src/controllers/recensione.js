const Transazione = require("../models/transazione");
const Annuncio = require("../models/annuncio");
const Utente = require("../models/utente");
const Recensione = require("../models/recensione");

const auxdate = require("../auxiliaries/dateFunction");

const saveNewRecensione = (req, res) => {

    Recensione.findById(req.body.transazioneRecensita, (err, data) => {
        if(!data){
            Transazione.findById(req.body.transazioneRecensita, (err, data) => {
                if(data){           
        
                    if(data.venditore == req.body.utenteRecensito && data.acquirente == req.body.utenteRecensore){
                        if(!auxdate.validateDate2(req.body.dataRecensione)){
                            return res.status(400).json({success: false, message: "Formato data non valido"});
                        }
        
                        if(!(req.body.stelle>= 0 && req.body.stelle <=5 && req.body.descrizione.length <= 200)){
                            return res.status(400).json({success: false, message: "Recensione mal formulata"});
                        }
        
                        const newT = new Recensione({
                            utenteRecensito : req.body.utenteRecensito,
                            utenteRecensore : req.body.utenteRecensore,
                            transazioneRecensita : req.body.transazioneRecensita,
                            _id : req.body.transazioneRecensita,
                            stelle : req.body.stelle,
                            descrizione : req.body.descrizione,
                            dataRecensione : req.body.dataRecensione
                        });
        
                        newT.save((err, data) => {
                            if(err) return res.status(500).json({Error: err});
                            return res.status(201).json(data);
                        })
        
                    } else {
                        if (err) return res.status(500).json({Error : err});
                        return res.status(404).json({success: false, message: "Utenti e transizione non coincidenti!"});
                    }
                    
                } else {
                    if (err) return res.status(500).json({Error: err});
                    res.status(404).json({success: false, message : "Transazione non esistente"});
                }
            });
        } else {
            if(err) return res.status(500).json({Error : err});
            return res.status(409).json({success: false, message : "Già salvata una recensione per questa transazione"});
        }
    });

}

const getAll = (req, res) => {
    Recensione.find({}, (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message : "Nessuna recensione salvata"})
            }

            return res.status(200).json(data);

        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Nessuna recensione salvata"})
        }
    })
}

const getRecensito = (req, res) => {
    const seller = req.params.recensito;
    Recensione.find({utenteRecensito : seller}, (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message : "Nessuna recensione su " + seller})
            }

            return res.status(200).json(data);

        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Nessuna recensione su " + seller})
        }
    })
}

const getRecensore = (req, res) => {
    const buyer = req.params.recensore;
    Recensione.find({utenteRecensore : buyer}, (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message : "Nessuna recensione fatta da " + buyer})
            }

            return res.status(200).json(data);

        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Nessuna recensione fatta da " + buyer})
        }
    })
}

const deleteRecensioneById = async (req, res) => {
    let recensione = await Recensione.findById(req.params.id).exec();
    if(!recensione){
        return res.status(404).json({success: false, message : "Nessuna recensione con id '" + req.params.id + "'!"})
    }
    await Recensione.deleteOne({_id : req.params.id});
    return res.status(204).send();
}

const getTransazione = (req, res) => {
    const transz = req.params.transazione;
    Recensione.find({transazioneRecensita : transz}, (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message : "Nessuna recensione associata a " + transz})
            }

            return res.status(200).json(data);

        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Nessuna recensione associata a " + transz})
        }
    })
}

module.exports = {
    saveNewRecensione,
    getAll,
    getRecensito,
    getRecensore,
    getTransazione,
    deleteRecensioneById
}