const Transazione = require("../models/transazione");
const Annuncio = require("../models/annuncio");
const Utente = require("../models/utente");

const auxdate = require("../auxiliaries/dateFunction");
const auxId = require("../auxiliaries/createId");

const saveNewTrans = (req, res) => {
    const id = auxId.createId(req.body.dataTransazione,req.body.prodotto,req.body.acquirente, req.body.venditore);

    Transazione.findById(id, (err, data) => {
        if(!data){

            if(!req.body.dataTransazione){
                req.body.dataTransazione = new Date();
            }
            
            Utente.findOne({username : req.body.acquirente}, (err, data) => {
                if(data){
                    Annuncio.findOne({titolo : req.body.prodotto}, (err, data) => {
                        if(data){
                            if(data.inserzionista == req.body.venditore){
                                const newT = new Transazione({
                                    _id : id,
                                    venditore : req.body.venditore,
                                    acquirente : req.body.acquirente,
                                    prodotto : req.body.prodotto,
                                    pagamentoEffettuato : req.body.pagamentoEffettuato,
                                    costo : data.prezzo,
                                    dataTransazione : req.body.dataTransazione,
                                    metodoTransazione : req.body.metodoTransazione
                                });
                                newT.save((err, data)=>{
                                    if(err) return res.status(500).json({Error: err});
                                    return res.status(201).json(data);
                                })
                            } else {
                                return res.status(404).json({success: false, message: "Mis-Match venditore-annuncio!"});                                
                            }
                        } else {
                            if(err) return res.status(500).json({Error: err});
                            return res.status(404).json({success: false, message: "L'annuncio cercato non esiste!"});                            
                        }
                    })
                } else {
                    if(err) return res.status(500).json({Error: err});
                    return res.status(404).json({success: false, message: "L'utente acquirente non esiste!"});                    
                }
            })
            
        } else {
            if (err) return res.status(500).json({Error: err});
            res.status(409).json({success: false, message : "Transazione già salvata"});
        }
    })
}

const getAll = (req, res) => {
    Transazione.find({}, (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message : "Nessuna transazione salvata"})
            }

            return res.status(200).json(data);

        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Nessuna transazione salvata"})
        }
    })
}

const getVenditore = (req, res) => {
    const seller = req.params.venditore;
    Transazione.find({venditore : seller}, (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message : "Nessuna transazione in uscita per " + seller})
            }

            return res.status(200).json(data);

        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Nessuna transazione in uscita per " + seller})
        }
    })
}

const getAcquirente = (req, res) => {
    const buyer = req.params.acquirente;
    Transazione.find({acquirente : buyer}, (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message : "Nessuna transazione in entrata per " + buyer})
            }

            return res.status(200).json(data);

        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Nessuna transazione in entrata per " + buyer})
        }
    })
}

const deleteTransazioneById = async (req, res) => {
    let transazione = await Transazione.findById(req.params.id).exec();
    if(!transazione){
        return res.status(404).json({success: false, message : "Nessuna tranzione con id '" + req.params.id + "'!"})
    }
    await Transazione.deleteOne({_id : req.params.id});
    return res.status(204).send();
}

const getAnnuncio = (req, res) => {
    const product = req.params.annuncio;
    Transazione.find({prodotto : product}, (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message : "Nessuna transazione associata a " + product})
            }

            return res.status(200).json(data);

        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Nessuna transazione associata a " + product})
        }
    })
}

module.exports = {
    saveNewTrans,
    getAll,
    getVenditore,
    getAcquirente,
    deleteTransazioneById,
    getAnnuncio
}