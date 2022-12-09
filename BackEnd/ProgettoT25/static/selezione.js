const annuncio = require('./script.js');

function onStart() {
    document.getElementById('title').innerHTML = annuncio.titolo;
}

onStart();