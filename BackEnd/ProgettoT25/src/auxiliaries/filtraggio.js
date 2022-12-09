const { rawListeners } = require("../models/annuncio");

const totFiltri = 7;
const filtri = [];
for(let i = 0; i < totFiltri; i++){
    filtri[i] = {$exists: true}
}

const commuteFilter = function(body){
    for(let i = 0; i < totFiltri; i++){
        filtri[i] = {$exists: true}
    }
    if(body.categoria != undefined){
        filtri[0] = body.categoria;
    }
    if(body.modalitaTransazione != undefined){
        filtri[1] = body.modalitaTransazione;
    }
    if(body.pagamentoOnline != undefined){
        filtri[2] = body.pagamentoOnline;
    }
    if(body.startPrice != undefined && body.endPrice != undefined){
        filtri[3] = { $gte: body.startPrice, $lte: body.endPrice};
    }
    const indirizzoRitiro = {via : {$exists: true}, citta: {$exists: true}, provincia: {$exists: true}};
    if(body.citta != undefined){
        indirizzoRitiro.citta = body.citta;
        filtri[4] = indirizzoRitiro;
    }
    if(body.provincia != undefined){
        indirizzoRitiro.provincia = body.provincia;
        filtri[4] = indirizzoRitiro;
    }
}

const filterArray = function(arrayFiltrato, body){
    const cat = body.categoria;
    const trans = body.transazione;
    const pon = body.pagamentoOnline;
    const sp = body.startPrice;
    const ep = body.endPrice;
    const cit = body.citta;
    const prov = body.provincia;

    const sd = body.startDate;
    const ed = body.endDate;

    if(cit != undefined){
        arrayFiltrato = arrayFiltrato.filter(function(arrElement){
            if(arrElement.indirizzoRitiro == undefined){
                return false;
            }
            const p = JSON.parse('' + arrElement.indirizzoRitiro);
            console.log(p.citta);
            return p.citta == cit;
        })
    }

    if(prov != undefined){
        arrayFiltrato = arrayFiltrato.filter(function(arrElement){
            if(arrElement.indirizzoRitiro == undefined){
                return false;
            }
            const p = JSON.parse('' + arrElement.indirizzoRitiro);
            console.log(p.provincia);
            return p.provincia == prov;       
        })
    }

    if( sp != undefined){
        arrayFiltrato = arrayFiltrato.filter(function(arrElement) {
            return arrElement.prezzo >= sp;
        })
    }

    if(ep != undefined){
        arrayFiltrato = arrayFiltrato.filter(function(arrElement) {
            return arrElement.prezzo <= ep;
        })
    }

    if(cat != undefined){
        arrayFiltrato = arrayFiltrato.filter(function(arrElement){
            return arrElement.categoria == cat;
        })
    }

    if(trans != undefined){
        arrayFiltrato = arrayFiltrato.filter(function(arrElement){
            return arrElement.modalitaTransazione == trans;
        })
    }

    if(pon != undefined){
        arrayFiltrato = arrayFiltrato.filter(function(arrElement){
            return arrElement.pagamentoOnline == pon;
        })
    }

    if(sd != undefined){
        arrayFiltrato = arrayFiltrato.filter(function(arrElement){
            return arrElement.dataPubblicazione >= sd;
        })
    }

    if(ed != undefined){
        arrayFiltrato = arrayFiltrato.filter(function(arrElement){
            return arrElement.dataPubblicazione <= ed;
        })
    }

    return arrayFiltrato;


}
module.exports = {filtri, commuteFilter, filterArray};