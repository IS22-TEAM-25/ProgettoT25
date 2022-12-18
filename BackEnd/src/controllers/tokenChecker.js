const jwt = require('jsonwebtoken'); 

const tokenChecker = function(req, res, next) {
	
    //il token DEVE essere passato:
    //- nella header nella voce 'x-access-token'
	var token = req.headers['x-access-token'];


	// if there is no token
	if (!token) {
		return res.status(401).send({ 
			success: false,
			message: 'Token non fornito'
		});
	}

	// decode token, verifies secret and checks exp
	jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
		if (err) {
			return res.status(403).send({
				success: false,
				message: 'Token non valido!'
			});		
		} else {
			req.loggedUser = decoded;
			//console.log(decoded);
			// loggedUser ha altre variabili oltre al toke  tra cui 
			// l'ID dell'utente autenticato
			next();
		}
	});
	
};

module.exports = tokenChecker