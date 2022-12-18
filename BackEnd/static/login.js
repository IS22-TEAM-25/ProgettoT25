const User = require("../src/models/utente");

async function login(){
    
    var usernameInserito = document.getElementById("loginUsername").value;
    var passwordInserita = document.getElementById("loginPassword").value;

    fetch('http://localhost:8080/api/l/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { username: usernameInserito, password: passwordInserita } ),
    }).then((resp) => resp.json())
    .then(esito => {
        var e = esito;
        // fetch('http://localhost:8080/api/u/getu/'+usernameInserito)
        // .then ((resp) => resp.text())
        // .then ((ut) => {
        //     // var u = JSON.parse(ut);
        //     // var d = JSON.parse(u[0].datadinascita);
        //     // document.getElementById("esito").innerHTML = d.year;
        //     // Variante fatta meglio!
        //     // var u = JSON.parse(ut);
        //     // document.getElementById("esito").innerHTML = u[0].datadinascita.year;
        // })
        document.getElementById("esito").innerHTML = e.message;
    })

        document.getElementById("loginPassword").value = "";
 
}