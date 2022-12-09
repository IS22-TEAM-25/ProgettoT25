const aux = require("../auxiliaries/checks");
const auxFilters = require("../auxiliaries/filtraggio");

const Annuncio = require("../models/annuncio");
const User = require("../models/utente");
const saveNewAnnuncio = (req,res) => {
    Annuncio.findOne({titolo: req.body.titolo}, (err, data) => {
        if(!data){
            User.findOne({username: req.body.inserzionista}, (err, data) => {
                if(!data){
                    if (err) return res.status(500).json('Errore! ${err}');
                    return res.status(404).json({success: false, message: "Inserzionista non presente!"});
                } else {

                    if(req.body.pagamentoOnline){
                        if(req.body.pagamentoOnline == "true"){
                            if (!req.body.contoPayPal){
                                return res.status(400).json({success: false, message: "Specificare un conto per il pagamento online!"});
                            }
                        }
                    }

                    if(!aux.validateDate(req.body.dataPubblicazione)){
                        return res.status(400).json({success : false, message: "Data non valida!"});
                    }

                    const indirizzoRitiro = {via : req.body.via, citta: req.body.citta, provincia: req.body.provincia};

                    const newAnnuncio = new Annuncio ({
                        _id : req.body.titolo,
                        inserzionista : req.body.inserzionista,
                        titolo : req.body.titolo,
                        descrizione : req.body.descrizione,
                        dataPubblicazione : req.body.dataPubblicazione,
                        modalitaTransazione : req.body.modalitaTransazione,
                        categoria : req.body.categoria,
                        indirizzoRitiro : JSON.stringify(indirizzoRitiro),
                        pagamentoOnline : req.body.pagamentoOnline,
                        contoPayPal : req.body.contoPayPal,
                        sponsorizzato : req.body.sponsorizzato,
                        prezzo : req.body.prezzo
                    });

                    newAnnuncio.save((err, data) => {
                        if (err) return res.status(500).json({Error: err});
                        return res.status(201).json(data);
                    })
                }
            }) 
        } else {
            if (err) return res.status(500).json ('Errore! ${err}');
            return res.status(400).json({success: false, message:"Annuncio già presente con questo titolo!"});
        }
    })
}

const getAll = (req,res) => {
    Annuncio.find({},(err,data)=>{
        if(data){
            return res.status(200).json(data);
        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Nessun annuncio presente"})
        }
    })
}

const getById = (req,res) => {
    Annuncio.findById(req.params.id, (err, data) => {
        if(data){
            return res.status(200).json(data);
        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun annuncio dal titolo " + req.params.id})
        }
    })
}

const getByUser = (req, res) => {
    Annuncio.find({inserzionista : req.params.inserzionista}, (err, data)=>{
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message: "Nessun annuncio di " + req.params.inserzionista})
            }
            return res.status(200).json(data);
        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun annuncio di " + req.params.inserzionista})
        }
    })
}

const deleteAnnuncioById = async (req, res) => {
    let annuncio = await Annuncio.findById(req.params.id).exec();
    if(!annuncio){
        return res.status(404).json({success: false, message : "Nessuno annunco dal titolo '" + req.params.id + "'!"})
    }
    await Annuncio.deleteOne({_id : req.params.id});
    return res.status(204).send();
}

const getByFilters = (req,res) => {
    auxFilters.commuteFilter(req.body);
    const vf = auxFilters.filtri;
    // for(let i = 0; i<5; i++){
    //     console.log(vf[i]);
    // }
    Annuncio.find(
        {categoria: vf[0], modalitaTransazione: vf[1], pagamentoOnline: vf[2],
        prezzo: vf[3], indirizzoRitiro: vf[4]}, 
        (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message: "Nessun annuncio corrispondente ai filtri scelti"});
            }
            return res.status(200).json(data);
        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun annuncio corrispondente ai filtri scelti"});
        }
    })
}

const filtraggioSuArray = (req, res) => {
    Annuncio.find({}, (err, data) => {
        if(data){
            if(data[0] == undefined){
                return res.status(404).json({success: false, message : "Nessun annuncio trovato"});
            } else {
                return res.status(200).send(auxFilters.filterArray(data,req.body));
            }
        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message : "Nessun annuncio trovato"});
        }
    });
}

const updateAnn = (req, res) => {
    Annuncio.findOne({titolo : req.body.titolo}, (err, data) => {
        if(!data){
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Annuncio non trovato"});
        } else {

            if(req.body.pagamentoOnline){
                if(req.body.pagamentoOnline == "true"){
                    if (!req.body.contoPayPal){
                        return res.status(400).json({success: false, message: "Specificare un conto per il pagamento online!"});
                    }
                }
            }

            var indRit;
            if(req.body.via && req.body.citta && req.body.provincia){
                indRit = {via : req.body.via, citta: req.body.citta, provincia: req.body.provincia};
            }

            Annuncio.updateOne({titolo : req.body.titolo},
                { $set : {
                    descrizione : req.body.descrizione,
                    modalitaTransazione : req.body.modalitaTransazione,
                    prezzo : req.body.prezzo,
                    categoria : req.body.categoria,
                    indirizzoRitiro : JSON.stringify(indRit),
                    pagamentoOnline : req.body.pagamentoOnline,
                    contoPayPal : req.body.contoPayPal,
                    visibile : req.body.visibile,
                    sponsorizzato : req.body.sponsorizzato
                }}, (err, data) => {
                    if(err) return res.status(500).json({Error: err});
                    return res.status(200).json({success: true, message : "Dati correttamente aggiornati"});    
                })
        }
    });
}


//export controller functions
module.exports = {
    saveNewAnnuncio,
    deleteAnnuncioById,
    getAll,
    getById,
    getByUser,
    getByFilters,
    filtraggioSuArray,
    updateAnn
}
