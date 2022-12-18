const aux = require("../auxiliaries/helpProfilo")

const User = require("../models/utente");
const Profilo = require("../models/profilo");
const Annuncio = require("../models/annuncio");
const Transazione = require("../models/transazione");
const Recensione = require("../models/recensione");

const saveNewProfilo = (req, res) => {
    Profilo.findById(req.body.idUtente, (err, data) => {
        if(!data){
            User.findOne({username : req.body.idUtente}, (err, data) => {
                if(data){

                    if(req.body.descrizioneProfilo.length > 250){
                        return res.status(400).json({success: false, message: "Descrizione troppo lunga!"});
                    }

                    const newP = new Profilo({
                        _id : req.body.idUtente,
                        dataCreazioneProfilo : new Date(),
                        descrizioneProfilo : req.body.descrizioneProfilo
                    });
                    newP.save((err, data) => {
                        if(err) return res.status(500).json({Error: err});
                        return res.status(201).json(data);
                    });
                } else {
                    if(err) return res.status(500).json({Error: err});
                    return res.status(404).json({success: false, message: "Utente non presente!"});
                }
            })
        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(409).json({success: false, message : "Profilo già presente per questo utente!"});
        }
    })
}

const getAll = (req, res) => {
    Profilo.find({}, (err, data) => {

        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message: "Nessun profilo presente"})
            }
            return res.status(200).json(data);
        } else {
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun profilo presente"});
        }
    });
}

const getProfiloById = (req, res) => {
    Profilo.findById(req.params.id, (err, data) => {
        if(!data){
            return res.status(404).json({success: false, message: "Nessun profilo con id " + req.params.id});
        } else if(data){
            return res.status(200).json(data);
        } else {
            return res.status(500).json({Error: err});
        }
    })
}

const deleteProfilo = async (req, res) => {

    let data = await Profilo.findById(req.params.id).exec();

    if(!data){
        return res.status(404).json({success: false, message: "Profilo non presente!"})
    } else {
        await Profilo.deleteOne({_id: req.params.id});
        return res.status(204).send();
    }

}

const modificaDescrizione = (req, res) => {
    Profilo.findById(req.body.id, (err, data) => {
        if(data){
            if(req.body.descrizioneProfilo.length > 250){
                return res.status(400).json({success: false, message: "Descrizione troppo lunga!"});
            } else {
                Profilo.updateOne({_id : req.body.id}, {
                    $set : {descrizioneProfilo : req.body.descrizioneProfilo}
                }, (err, data) => {
                    if(err) return res.status(500).json({Error: err});
                    return res.status(204).send();    
                })
            }
        } else {
            return res.status(404).json({success: false, message: "Profilo con id " + req.body.id + " non presente"})
        }
    })
}

const aggiungiWl = (req, res) => {
    const annuncio = req.body.annuncio;
    Annuncio.findById(annuncio, (err, data) => {
        if(data){
            Profilo.findById(req.body.id, (err, data) => {
                if(data){
                    if(data.whishList.includes(annuncio)){
                        return res.status(409).json({success : false, message: "Annuncio già presente in whishlist!"})
                    } else {
                        const wl = data.whishList;
                        wl.push(annuncio);
                        Profilo.updateOne({_id : req.body.id}, 
                            {$set : {whishList : wl}
                            }, (err,data) => {
                                if(err) return res.status(500).json({Error: err});
                                return res.status(204).send();
                            }
                        );
                    }
                } else {
                    if(err) return res.status(500).json({Error: err});
                    return res.status(404).json({success : false, message : "Nessun profilo con l'id specificato"})
                }
            })
        } else {
            if(err) return res.status(500).json({Error: err})
            return res.status(404).json({success: false, message: "Nessun annuncio col titolo " + annuncio})
        }
    })    
}

const rimuoviWl = (req, res) => {
    const annuncio = req.body.annuncio;
    Annuncio.findById(annuncio, (err, data) => {
        if(data){
            Profilo.findById(req.body.id, (err, data) => {
                if(data){
                    if(!data.whishList.includes(annuncio)){
                        return res.status(409).json({success : false, message: "Annuncio già assente in whishlist!"})
                    } else {
                        const wl = data.whishList;
                        const index = wl.indexOf(annuncio);
                        wl[index] = wl[0];
                        wl[0] = annuncio;
                        wl.shift();
                        Profilo.updateOne({_id : req.body.id}, 
                            {$set : {whishList : wl}
                            }, (err,data) => {
                                if(err) return res.status(500).json({Error: err});
                                return res.status(204).send();
                            }
                        );
                    }
                } else {
                    if(err) return res.status(500).json({Error: err});
                    return res.status(404).json({success : false, message : "Nessun profilo con l'id specificato"})
                }
            })
        } else {
            if(err) return res.status(500).json({Error: err})
            return res.status(404).json({success: false, message: "Nessun annuncio col titolo " + annuncio})
        }
    })  
}

const commuteBestUsers = (req, res) => {
    Profilo.find({}, (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message: "Nessun profilo presente"})
            }
            var sorted_users = data.sort(function(a,b) {
                return b.rating - a.rating;
            })
            return res.status(200).json(sorted_users);
        } else {
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun profilo presente"});
        }
    });
}

const updateRating = (req, res) => {
    Profilo.findById(req.body.id, (err, data) => {
        if(data){
            var recFatte = 0, recRicevute = 0;
            Recensione.find({utenteRecensito : req.body.id}, (err, data) => {
                if(data){
                    recRicevute = data.length;
                    let newRate = 0;
                    if(recRicevute != 0){
                        let sum=0;
                        for(let i =0;i<recRicevute;i++){
                            sum+=data[i].stelle;
                        }
                        newRate = sum/recRicevute;    
                    }
                    Recensione.find({utenteRecensore : req.body.id}, (err, data) => {
                        if(data){
                            recFatte = data.length;
                            Profilo.updateOne({_id : req.body.id}, 
                                {$set : {recensioniFatte : recFatte, recensioniRicevute : recRicevute, rating : newRate}},
                                (err, data) => {
                                    if(err) return res.status(500).json({Error: err});
                                    return res.status(204).send();            
                                })
                        } else {
                            if (err) return res.status(500).json({Error: err});
                        }
                    })
                } else {
                    if (err) return res.status(500).json({Error: err});
                }
            })
        } else {
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun profilo con id " + req.body.id})
        }
    })
}

const updateAnnunciOnline = (req, res) => {
    Profilo.findById(req.body.id, (err, data) => {
        if(data){

            Annuncio.find({inserzionista: req.body.id}, (err, data) => {
                if(data){
                    if(data[0] == undefined){
                        return res.status(404).json({success: false, message: "Nessun annuncio di " + req.body.id})
                    }
                    
                    var n = data.length;
                    var totAff = 0;
                    var totVen = 0;
                    for(let i = 0; i < n; i++){
                        if(data[i].visibile == true){
                            if(data[i].modalitaTransazione == "Affitto"){
                                totAff++;
                            } else {
                                totVen++;
                            }
                        } 
                    }

                    Profilo.updateOne({_id : req.body.id},
                        {$set : {annunciOnlineAffitto : totAff, annunciOnlineVendita : totVen}},
                        (err, data) => {
                            if(err) return res.status(500).json({Error: err});
                            return res.status(204).send();    
                    })

                } else {
                    if (err) return res.status(500).json({Error: err});
                    return res.status(404).json({success: false, message: "Nessun annuncio di " + req.body.id})
                }
            })
        } else {
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun profilo con id " + req.body.id})
        }
    })
};

const updateStatisticheVendita = (req, res) => {
    Profilo.findById(req.body.id, (err, data) => {
        if(data){
            Transazione.find({venditore: req.body.id}, (err, data) => {
                if(data) {
                    if(data[0] == undefined){
                        return res.status(404).json({success: false, message: "Nessuna transazione completat da id " + req.body.id})        
                    }

                    var totaleTransazioniCompletate = data.length;
                    var guadagniAff = 0, guadagniVend = 0, venditeCompletate = 0;

                    for(let i = 0; i < totaleTransazioniCompletate; i++){
                        if(data[i].tipologiaTransazione == "Affitto"){
                            guadagniAff+=data[i].costo;
                        } else {
                            venditeCompletate++;
                            guadagniVend+=data[i].costo;
                        }
                    }

                    Profilo.updateOne({_id : req.body.id}, 
                        {$set : {transazioniCompletate : totaleTransazioniCompletate,
                        guadagnoDagliAffitti : guadagniAff,
                        guadagnoDalleVendite : guadagniVend,
                        prodottiVenduti : venditeCompletate}},
                        (err, data) => {
                            if(err) return res.status(500).json({Error: err});
                            return res.status(204).send();            
                        })

                } else {
                    if (err) return res.status(500).json({Error: err});
                    return res.status(404).json({success: false, message: "Nessuna transazione completata da id " + req.body.id})        
                }
            })

        } else {
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun profilo con id " + req.body.id})
        }
    })
}

const updateStatisticheAcquisti = (req, res) => {
    Profilo.findById(req.body.id, (err, data) => {
        if(data){
            if(data.length == 0){
                return res.status(404).json({success: false, message: "Nessun profilo con id " + req.body.id})
            }
            var spesi = 0;
            Transazione.find({acquirente : req.body.id}, (err, data) => {
                if(data){
                    for(let i = 0; i < data.length; i++){
                        spesi+=data[i].costo;
                    }
                    Profilo.updateOne({_id : req.body.id}, {$set : {soldiSpesi : spesi}}, (err, data) => {
                        if(err) return res.status(500).json({Error: err});
                        return res.status(204).send();            
                    })
                }
            })
        } else {
            if (err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun profilo con id " + req.body.id})
        }
    })
}

module.exports = {
    saveNewProfilo,
    getAll,
    getProfiloById,
    deleteProfilo,
    modificaDescrizione,
    aggiungiWl,
    rimuoviWl,
    updateRating,
    updateAnnunciOnline,
    updateStatisticheVendita,
    commuteBestUsers,
    updateStatisticheAcquisti
}
