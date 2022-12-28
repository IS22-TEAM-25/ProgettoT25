const endDate = new Date('2023-01-01');
const startDate = new Date('2022-12-30');

const prezzoAffittoAlGiorno = 10;

var differenceInTime = new Date(endDate) - new Date(startDate);
var totalDays = differenceInTime / (1000 * 3600 * 24);
var costoEffettivo = prezzoAffittoAlGiorno * (totalDays);
console.log("il numero tot di giorni è: ", totalDays)
console.log("il costo è: ", costoEffettivo)