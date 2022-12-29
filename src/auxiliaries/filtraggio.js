const { rawListeners } = require("../models/annuncio");
const auxdata = require("../auxiliaries/dateFunction");

const filterArray = function(arrayFiltrato, body){
    const cat = body.categoria;
    const trans = body.transazione;
    const pon = body.pagamentoOnline;                                                                                                                                                                                       
    const cit = body.citta;                                                                                                                                                                                                                                                                                         
    const prov = body.provincia;
    const sp = body.startPrice;
    const ep = body.endPrice;

    const sd = body.startDate;
    const ed = body.endDate;

    if(cit != undefined){
        if(cit != "null"){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                if(arrElement.indirizzoRitiro == undefined){
                    return false;
                }
                const p = JSON.parse('' + arrElement.indirizzoRitiro);
                return p.citta == cit;
            })
        }
    }

    if(prov != undefined){
        if(prov != "null"){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                if(arrElement.indirizzoRitiro == undefined){
                    return false;
                }
                const p = JSON.parse('' + arrElement.indirizzoRitiro);
                return p.provincia == prov;       
            })
        }
    }

    //filtriamo su prezzo e prezzoGiornaliero!

    if(sp != undefined){
        if (sp != "null"){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement) {
                if(arrElement.modalitaTransazione == "Affitto"){
                    return arrElement.prezzoAffittoAlGiorno >= sp;
                } else {
                    return arrElement.prezzo >= sp;
                }
            })
        }
    }

    if(ep != undefined){
        if (ep != "null"){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement) {
                if(arrElement.modalitaTransazione == "Affitto"){
                    return arrElement.prezzoAffittoAlGiorno <= ep;
                } else {
                    return arrElement.prezzo <= ep;
                }       
            })
        }
    }

    if(cat != undefined){
        if(cat != "null"){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                return arrElement.categoria == cat;
            })
        }
    }

    if(trans != undefined){
        if( trans != "null"){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                return arrElement.modalitaTransazione == trans;
            })
        }
    }

    if(pon != undefined){
        if(pon != "null"){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                return ('' + arrElement.pagamentoOnline) == pon;
            })
        }
    }

    if(sd != undefined){
        if (sd != "null"){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                const d = new Date(sd);
                return arrElement.dataPubblicazione >= d;
            })
        }
    }

    if(ed != undefined){
        if (ed != "null"){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                const d = new Date(ed);
                return arrElement.dataPubblicazione <= d;
            })
        }
    }

    return arrayFiltrato;

}

const orderAnnunciByDate = function(annunci){
    var annunciordinati = annunci.sort(function(a,b){
        return a.dataPubblicazione - b.dataPubblicazione;
    });
    return annunciordinati;
}

//Sia in vendita che in affitto
//Ordinando su prezzo o prezzo giornaliero
const orderAnnunciByMoney = function(annunci){
    var annunciordinati = annunci.sort(function(a,b){
        if(a.modalitaTransazione == "Affitto" && b.modalitaTransazione == "Affitto"){
            return a.prezzoAffittoAlGiorno - b.prezzoAffittoAlGiorno;
        } else if (a.modalitaTransazione == "Affitto" && b.modalitaTransazione == "Vendita") {
            return a.prezzoAffittoAlGiorno - b.prezzo;
        } else if (a.modalitaTransazione == "Vendita" && b.modalitaTransazione == "Affitto") {
            return a.prezzo - b.prezzoAffittoAlGiorno;
        } else /*if (a.modalitaTransazione == "Vendita" && b.modalitaTransazione == "Vendita")*/ {
            return a.prezzo - b.prezzo;
        }
    });
    return annunciordinati;
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

//Le stesse funzioni ma in ordine DISCENDENTE!
const orderAnnunciByDateDESC = function(annunci){
    var annunciordinati = annunci.sort(function(a,b){
        return b.dataPubblicazione - a.dataPubblicazione;
    });
    return annunciordinati;
}

//Sia in vendita che in affitto
const orderAnnunciByMoneyDESC = function(annunci){
    var annunciordinati = annunci.sort(function(a,b){
        if(b.modalitaTransazione == "Affitto" && a.modalitaTransazione == "Affitto"){
            return b.prezzoAffittoAlGiorno - a.prezzoAffittoAlGiorno;
        } else if (b.modalitaTransazione == "Affitto" && a.modalitaTransazione == "Vendita") {
            return b.prezzoAffittoAlGiorno - a.prezzo;
        } else if (b.modalitaTransazione == "Vendita" && a.modalitaTransazione == "Affitto") {
            return b.prezzo - a.prezzoAffittoAlGiorno;
        } else /*if (b.modalitaTransazione == "Vendita" && a.modalitaTransazione == "Vendita")*/ {
            return b.prezzo - a.prezzo;
        }
    });
    return annunciordinati;
}

const filterByTerm = function(annunci, searchTerm){
    const regex = new RegExp(searchTerm, "i");
    return annunci.filter(function(arrayElement) {
        return arrayElement.titolo.match(regex);
    })
}

const filterByTermDesc = function(annunci, searchTerm){
    const regex = new RegExp(searchTerm, "i");
    return annunci.filter(function(arrayElement) {
        return arrayElement.descrizione.match(regex);
    })
}

module.exports = {
    filterArray, 
    orderAnnunciByDate, orderAnnunciByMoney,
    orderAnnunciByDateDESC, orderAnnunciByMoneyDESC,
    filterByTerm, filterByTermDesc
};
