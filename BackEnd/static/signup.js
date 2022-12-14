function reg(){

    document.getElementById("esito").innerHTML = "";

    var nomeIns = document.getElementById("idnome").value;
    if(nomeIns.length == 0){
            document.getElementById("esito").innerHTML = "Nome assente!";
            return;
    }
    var cognomeIns = document.getElementById("idcognome").value;
    if(cognomeIns.length == 0){
        document.getElementById("esito").innerHTML = "Cognome assente!";
        return;
    }
    var datadinascitaIns = document.getElementById("idddn").value;
    if(datadinascitaIns.length == 0){
        document.getElementById("esito").innerHTML = "Data di nascita assente!";
        return;
    } else {
        datadinascitaIns = "2012-04-23T18:25:43.511Z";
    }
    var indirizzoIns = document.getElementById("idindirizzo").value;
    if(indirizzoIns.length == 0){
        document.getElementById("esito").innerHTML = "Indirizzo assente!";
        return;
    }
    var emailIns = document.getElementById("idemail").value;
    if(emailIns.length == 0){
        document.getElementById("esito").innerHTML = "Email assente!";
        return;
    }
    var usernameIns = document.getElementById("idusername").value;
    if(usernameIns.length == 0){
        document.getElementById("esito").innerHTML = "Username assente!";
        return;
    }
    var passwordIns = document.getElementById("idpassword").value;
    if(passwordIns.length == 0){
        document.getElementById("esito").innerHTML = "Password assente!";
        return;
    }
    

    fetch('http://localhost:8080/api/u/signUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {
            nome : nomeIns,
            cognome : cognomeIns,
            datadinascita: datadinascitaIns,
            indirizzo : indirizzoIns,
            email : emailIns,
            username: usernameIns,
            password: passwordIns
        } ),
    }).then((resp) => resp.json())
    .then(esito => {
        var e = esito;
        if(e.success == false){
            document.getElementById("esito").innerHTML = e.message;
        } else {
            document.getElementById("esito").innerHTML = 'Benvenuto, ' + nomeIns + '!';
        }
    })

}