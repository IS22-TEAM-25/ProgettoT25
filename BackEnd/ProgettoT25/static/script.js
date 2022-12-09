var allAnnunci;

function ottieniAnnunci(){

    fetch('http://localhost:8080/api/a/getAll')
    .then(data => {
        // return data.json();
        return data.text();
    })
    .then(annunci => {
        s = "";
        i = 0;

        var a = JSON.parse(annunci);
        allAnnunci = a;
        var list = document.getElementById("annunciList");
        var testo = document.createElement("p");
        testo.innerHTML = 'Annunci presenti nel sito:';
        list.appendChild(testo);

        while(a[i] != undefined){
            s = "'" + a[i].titolo + "' di " + a[i].inserzionista;
            var node = document.createElement("li");
            var testo = document.createElement("p");
            testo.setAttribute('onclick', 'moreInfo(' + i + ')');
            testo.innerHTML = s;
            node.appendChild(testo);
            list.appendChild(node);

            i++;
        }

        if(i==0){
            var node = document.createElement("li");
            var testo = document.createElement("p");
            testo.innerHTML = "Nessun annuncio presente!";
            node.appendChild(testo);
            list.appendChild(node);
        }
    });
};
let annuncioSelezionato;
function moreInfo(i){
    window.location = 'selezione.html';
    annuncioSelezionato = allAnnunci[i];
    // document.getElementById('st').innerHTML = annuncioSelezionato.titolo;
}

function ripristina(){
    window.location = 'index.html'
}

function login() {
    window.location = 'login.html';
}

function registrati() {
    window.location = 'registrazione.html';
}

module.exports = annuncioSelezionato;