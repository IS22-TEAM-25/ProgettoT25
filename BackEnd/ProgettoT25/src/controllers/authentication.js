const User = require("../models/utente");
const jwt = require('jsonwebtoken');

const login = async function(req, res){
    let user = await User.findOne({ username : req.body.username}).exec()

    if(!user){
        return res.json({success: false, message : 'Nessun utente con questo username!'})
    }

    if(user.password != req.body.password){
        return res.json({success: false, message : 'Password errata'})
    }

    var payload = {username: user.username, id: user._id};
    var options = {expiresIn: 23200};
    var tkn = jwt.sign(payload, process.env.SUPER_SECRET, options);
    return res.json({success: true, message : 'Welcome on your account, ' + user.username + '!', token: tkn, id:user._id})
}

const logout = function(req, res) {
    var tkn = req.headers['x-access-token'];
    if (tkn){
        var payload = {};
        var options = {expiresIn: 5};
        var tkn = jwt.sign(payload, process.env.SUPER_SECRET, options);    
        return res.json({success: true, message: "You logged out!", token: tkn});
    } else {
        return res.json({success: true, message: "You alreayd logged out!", token: tkn});
    }
}

//export controller functions
module.exports = {
    login,
    logout
}
