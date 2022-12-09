const aux = require("../auxiliaries/helpProfilo")

const User = require("../models/utente");
const Profilo = require("../models/profilo");
const Annuncio = require("../models/annuncio");

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
                    return res.status(200).json({success: true, message : "Dati correttamente aggiornati"});    
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

module.exports = {
    saveNewProfilo,
    getAll,
    getProfiloById,
    deleteProfilo,
    modificaDescrizione,
    aggiungiWl,
    rimuoviWl
}
