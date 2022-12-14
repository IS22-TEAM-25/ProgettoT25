const { rawListeners } = require("../models/annuncio");
const auxdata = require("../auxiliaries/dateFunction");

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
    const cit = body.citta;                                                                                                                                                                                                                                                                                         
    const prov = body.provincia;
    const sp = body.startPrice;
    const ep = body.endPrice;

    const sd = body.startDate;
    const ed = body.endDate;

    if(cit != undefined){
        if(cit != null){
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
        if(prov != null){
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
        if (sp != null){
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
        if (ep != null){
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
        if(cat != null){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                return arrElement.categoria == cat;
            })
        }
    }

    if(trans != undefined){
        if( trans != null){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                return arrElement.modalitaTransazione == trans;
            })
        }
    }

    if(pon != undefined){
        if(pon != null){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                return ('' + arrElement.pagamentoOnline) == pon;
            })
        }
    }

    //CAMBIO DI ROTTA, DATE CORRETTAMENTE SALVATE

    //Date le supponiamo ben formattate!!!

    if(sd != undefined){
        if (sd != null){
            arrayFiltrato = arrayFiltrato.filter(function(arrElement){
                const d = new Date(sd);
                return arrElement.dataPubblicazione >= d;
            })
        }
    }

    if(ed != undefined){
        if (ed != null){
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
        // const betterDataA = auxdata.convertDate(a.dataPubblicazione);
        // const betterDataB = auxdata.convertDate(b.dataPubblicazione);
        // const objDataB = new Date(betterDataB);
        // const objDataA = new Date(betterDataA);
        // if(objDataB < objDataA){
        //     return -1;
        // } else if(objDataB > objDataA){
        //     return 1;
        // } else {
        //     return 0;
        // }
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
        } else if (a.modalitaTransazione == "Vendita" && b.modalitaTransazione == "Vendita") {
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
        // const betterDataA = auxdata.convertDate(a.dataPubblicazione);
        // const betterDataB = auxdata.convertDate(b.dataPubblicazione);
        // const objDataB = new Date(betterDataB);
        // const objDataA = new Date(betterDataA);
        // if(objDataB < objDataA){
        //     return 1;
        // } else if(objDataB > objDataA){
        //     return -1;
        // } else {
        //     return 0;
        // }

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
        } else if (b.modalitaTransazione == "Vendita" && a.modalitaTransazione == "Vendita") {
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

module.exports = {filtri, commuteFilter, filterArray, 
    orderAnnunciByDate, orderAnnunciByMoney,
    orderAnnunciByDateDESC, orderAnnunciByMoneyDESC,
    filterByTerm, filterByTermDesc
};

// //Ipotizzo solo annunci in affitto!!
// const orderAnnunciByPrezzoGiornalieroDESC = function(annunci){
//     var annunciordinati = annunci.sort(function(a,b){
//         b.prezzoAffittoAlGiorno - a.prezzoAffittoAlGiorno;
//     });
//     return annunciordinati;
// }

// //Ipotizzo solo annunci in vendita!!
// const orderAnnunciByPrezzoDESC = function(annunci){
//     var annunciordinati = annunci.sort(function(a,b){
//         b.prezzo - a.prezzo;
//     });
//     return annunciordinati;
// }

// //Ipotizzo solo annunci in affitto!!
// const orderAnnunciByPrezzoGiornaliero = function(annunci){
//     var annunciordinati = annunci.sort(function(a,b){
//         a.prezzoAffittoAlGiorno - b.prezzoAffittoAlGiorno;
//     });
//     return annunciordinati;
// }

// //Ipotizzo solo annunci in vendita!!
// const orderAnnunciByPrezzo = function(annunci){
//     var annunciordinati = annunci.sort(function(a,b){
//         a.prezzo - b.prezzo;
//     });
//     return annunciordinati;
// }