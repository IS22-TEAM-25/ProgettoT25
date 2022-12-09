const User = require("../models/utente");

const login = async function(req, res){
    let user = await User.findOne({ username : req.body.username}).exec()

    if(!user){
        return res.json({success: false, message : 'Nessun utente con questo username!'})
    }

    if(user.password != req.body.password){
        return res.json({success: false, message : 'Password errata'})
    }

    return res.json({success: true, message : 'Welcome on your account, ' + user.username + '!'})
}

//export controller functions
module.exports = {
    login
}
