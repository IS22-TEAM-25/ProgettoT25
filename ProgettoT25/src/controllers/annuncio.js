const aux = require("../auxiliaries/checks");
const Annuncio = require("../models/annuncio");
const User = require("../models/utente");
const saveNewAnnuncio = (req,res) => {
    Annuncio.findOne({titolo: req.body.titolo}, (err, data) => {
        if(!data){
            User.findOne({username: req.body.inserzionista}, (err, data) => {
                if(!data){
                    if (err) return res.json('Errore! ${err}');
                    return res.json({message: "Inserzionista non presente!"});
                } else {

                    if(req.body.pagamentoOnline == 'true' && !req.body.contoPayPal){
                        return res.json({message: "Specificare un conto per il pagamento online!"});
                    }

                    const newAnnuncio = new Annuncio ({
                        _id : req.body.titolo,
                        inserzionista : req.body.inserzionista,
                        titolo : req.body.titolo,
                        descrizione : req.body.descrizione,
                        modalitaTransazione : req.body.modalitaTransazione,
                        categoria : req.body.categoria,
                        indirizzoRitiro : req.body.indirizzoRitiro,
                        pagamentoOnline : req.body.pagamentoOnline,
                        contoPayPal : req.body.contoPayPal,
                        sponsorizzato : req.body.sponsorizzato
                    });

                    newAnnuncio.save((err, data) => {
                        if (err) return res.json({Error: err});
                        return res.json(data);
                    })
                }
            }) 
        } else {
            if (err) return res.json ('Errore! ${err}');
            return res.json({message:"Annuncio già presente con questo titolo!"});
        }
    })
}

const getAll = (req,res) => {
    Annuncio.find({},(err,data)=>{
        if(data){
            return res.json(data);
        } else {
            if(err) return res.json({Error: err});
            return res.json({message : "Nessun annuncio presente"})
        }
    })
}

const getById = (req,res) => {
    Annuncio.findById(req.params.id, (err, data) => {
        if(data){
            return res.json(data);
        } else {
            if(err) return res.json({Error: err});
            return res.json({message: "Nessun annuncio dal titolo " + req.params.id})
        }
    })
}

const getByUser = (req, res) => {
    Annuncio.find({inserzionista : req.params.inserzionista}, (err, data)=>{
        if(data){
            return res.json(data);
        } else {
            if(err) return res.json({Error: err});
            return res.json({message: "Nessun annuncio di " + req.params.inserzionista})
        }
    })
}

const deleteAnnuncioById = async (req, res) => {
    let annuncio = await Annuncio.findById(req.params.id).exec();
    if(!annuncio){
        return res.status(404).json({message : "Nessuno annunco dal titolo '" + req.params.id + "'!"})
    }
    await Annuncio.deleteOne({_id : req.params.id});
    return res.json({message : "Annuncio eliminato", status : 204});
}

//export controller functions
module.exports = {
    saveNewAnnuncio,
    deleteAnnuncioById,
    getAll,
    getById,
    getByUser
}
