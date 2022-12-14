function createId(data, prodotto, acquirente, venditore){
    const dataobj = new Date(data);
    const tempo = dataobj.getTime();
    return prodotto.charAt(0) + "-" + acquirente.charAt(0) + "-" + venditore.charAt(0) + "-" + tempo;
}

module.exports = {createId};