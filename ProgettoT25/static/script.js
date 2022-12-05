
var annuncio = {}

function ottieniAnnunci(){

    fetch('http://localhost:8080/getu/firstuser69', {
        method : 'GET', 
        headers : {'Content-Type': 'application/json'}
    })
    .then(function (data) { 
        var persona = JSON.parse(data);
        document.getElementById("p1").innerHTML = persona;
    }).carch(function(err) {
    })

    // document.getElementById("p1").innerHTML = "ciao";

};