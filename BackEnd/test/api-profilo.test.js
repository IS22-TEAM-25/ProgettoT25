const { default: mongoose } = require('mongoose');
const request = require('supertest');
require('dotenv').config();
const app = require("../src/server");
const jwt = require('jsonwebtoken');

let server;

module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js']
}

beforeAll( async () => {
    jest.setTimeout(20000)
    app.locals.db = await mongoose.connect(process.env.DB_URI)
    server = app.listen(process.env.PORT || 8080);
    //Creiamo un utente per fare il profilo e un annuncio per la wishlist
    const utente1 = {
        username : "utentediprova",
        nome : "Mario",
        cognome : "Rossi",
        datadinascita : "2002-02-17",
        indirizzo : "via Roma 12, Povo, Trento",
        email : "mailutentediprova@gmail.com",
        password : "prova123!",
        metodiPagamento : "utentediprovapagamenti@gmail.com"
    }
    await request(process.env.START + "/").post("api/u/signUp").send(utente1);
    const annuncio = {
        titolo : "newAnnJestProfilo",
        inserzionista : "utentediprova",
        descrizione : "Nuovo annuncio di prova per il testing con Jest per la transazione",
        modalitaTransazione : "Vendita",
        categoria : "sport",
        via : "via Sommarive 20",
        citta : "Povo",
        provincia : "Trento",
        prezzo : 150
    }
    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );
    const resp = await request(process.env.START + "/").post("api/a/savea").set('x-access-token', token).send(annuncio);

})

afterAll(async () => {
    await request(process.env.START + "/").delete("api/a/deletea/newAnnJestProfilo")
    await request(process.env.START + "/").delete("api/u/deleteu/utentediprova").set('x-access-token',jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} ))
    mongoose.connection.close(true);
    server.close();
})
