const User = require("../models/utente");
const jwt = require('jsonwebtoken');
const createRandomString = require("../auxiliaries/randomString");

const login = async function(req, res){
    let user = await User.findOne({ username : req.body.username}).exec()

    if(!user){
        return res.status(400).json({success: false, message : 'Utente o password non corretti!'})
    }

    if(user.password != req.body.password){
        return res.status(400).json({success: false, message : 'Utente o password non corretti!'})
    }

    var payload = {username: user.username, id: user._id};
    var options = {expiresIn: 23200};
    var tkn = jwt.sign(payload, process.env.SUPER_SECRET, options);
    return res.status(200).json({success: true, message : 'Welcome on your account, ' + user.username + '!', token: tkn, id:user._id})
}

const logout = function(req, res) {
    var tkn = req.headers['x-access-token'];
    if (tkn){
        var payload = {};
        var options = {expiresIn: 5};
        var tkn = jwt.sign(payload, process.env.SUPER_SECRET, options);
        //dai al loggedUser il nuovo token!
        return res.status(200).json({success: true, message: "You logged out!"});
    } else {
        return res.status(200).json({success: true, message: "You alreayd logged out!"});
    }
}

const ripristinoPassword = function(req, res) {
    let usernameReq = req.body.username;

    let newPass = createRandomString(10);
    newPass += 'A!1';
    
    User.findOne({username: usernameReq}, (err, data) => {
        if(data){
            User.updateOne({username : usernameReq},
                { $set: {
                    password: newPass,
                }}, (err, data) => {
                if(err) return res.status(500).json({Error: err});
                return res.status(200).json({success: true, message: "Hai effettuato la richiesta di ripristino password. Ecco una password per accedere al tuo account:\n" + newPass + "\nTi consigliamo di cambiarla dalle impostazioni del profilo.\nIl team di SpottyThings."
            });
            })
        } else {
            if(err) return res.status(500).json({Error: err});
            return res.status(404).json({success: false, message: "Nessun utente trovato"})
        }
    })

}

//export controller functions
module.exports = {
    login,
    logout,
    ripristinoPassword
}
