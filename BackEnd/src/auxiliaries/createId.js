function createId(data, prodotto, acquirente, venditore){
    const tempo = data.getTime();
    return prodotto.charAt(0) + "-" + acquirente.charAt(0) + "-" + venditore.charAt(0) + "-" + tempo;
}

module.exports = {createId};