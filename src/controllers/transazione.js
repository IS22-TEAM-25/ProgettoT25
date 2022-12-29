const Transazione = require("../models/transazione");
const Annuncio = require("../models/annuncio");
const Utente = require("../models/utente");

const auxdate = require("../auxiliaries/dateFunction");
const auxId = require("../auxiliaries/createId");

const salvaTransazione = (req, res) => {
    const objd = new Date();
    const id = auxId.createId(objd,req.body.prodotto,req.body.acquirente, req.body.venditore);

    
    Transazione.findById(id, (err, data) => {
        if(!data){
            
            Utente.findOne({username : req.body.acquirente}, (err, data) => {
                if(data){
                    Annuncio.findOne({titolo : req.body.prodotto}, (err, data) => {
                        if(data){
                            var price = req.body.prezzo;
                            // if(data.modalitaTransazione == 'Vendita'){
                            //     price = data.prezzo;
                            // } else {
                            //     price = data.prezzoAffittoAlGiorno;
                            // }
                            if(data.inserzionista == req.body.venditore){
                                const newT = new Transazione({
                                    _id : id,
                                    venditore : req.body.venditore,
                                    acquirente : req.body.acquirente,
                                    prodotto : req.body.prodotto,
                                    pagamentoEffettuato : req.body.pagamentoEffettuato,
                                    costo : price,
                                    dataTransazione : objd,
                                    metodoTransazione : req.body.metodoTransazione,
                                    tipologiaTransazione : data.modalitaTransazione
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

const findAllTransazioni = (req, res) => {
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

const findTransazioniVenditore = (req, res) => {
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

const findTransazioniAcquirente = (req, res) => {
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

const eliminaTransazione = async (req, res) => {
    let transazione = await Transazione.findById(req.params.id).exec();
    if(!transazione){
        return res.status(404).json({success: false, message : "Nessuna tranzione con id '" + req.params.id + "'!"})
    }
    await Transazione.deleteOne({_id : req.params.id});
    return res.status(204).send();
}

const findTransazioniProdotto = (req, res) => {
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
    salvaTransazione,
    findAllTransazioni,
    findTransazioniVenditore,
    findTransazioniAcquirente,
    eliminaTransazione,
    findTransazioniProdotto
}