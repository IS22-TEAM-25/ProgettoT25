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
    //Creiamo utente1 che faccia l'annuncio
    //Creiamo l'annuncio
    //L'utente2 che compra l'annuncio è 'admin'
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
        titolo : "newAnnJestTransazione",
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

afterAll( async () => {
    await request(process.env.START + "/").delete("api/a/deletea/newAnnJestTransazione")
    await request(process.env.START + "/").delete("api/u/deleteu/utentediprova").set('x-access-token',jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} ))
    mongoose.connection.close(true);
    server.close();
})

describe('Suite testing api endpoint "api/t/savet"', () => {
    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").post("api/t/savet");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").post("api/t/savet").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    test("Chiamata all'API corretta", async () => {
        const inputBody = {
            venditore : "utentediprova",
            acquirente : "admin",
            prodotto : "newAnnJestTransazione",
            prezzo : 150,
            metodoTransazione : "Online"
        }
        const response = await request(process.env.START + "/").post("api/t/savet").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(201);
        expect(response.body.venditore).toEqual(inputBody.venditore);
        expect(response.body.acquirente).toEqual(inputBody.acquirente);
        expect(response.body.prodotto).toEqual(inputBody.prodotto);
        expect(response.body.metodoTransazione).toEqual(inputBody.metodoTransazione);
    })

    test("Chiamata all'API con utente acquirente non esistente", async () => {
        const inputBody = {
            venditore : "utentediprova",
            acquirente : "utenteNonEsistente",
            prodotto : "newAnnJestTransazione",
            prezzo : 150,
            metodoTransazione : "Online"
        }
        const response = await request(process.env.START + "/").post("api/t/savet").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API con annuncio non esistente", async () => {
        const inputBody = {
            venditore : "utentediprova",
            acquirente : "admin",
            prodotto : "annuncioNonEsistente",
            prezzo : 150,
            metodoTransazione : "Online"
        }
        const response = await request(process.env.START + "/").post("api/t/savet").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API con annuncio.inserzionista e venditore non uguali", async () => {
        const inputBody = {
            venditore : "admin",
            acquirente : "admin",
            prodotto : "newAnnJestTransazione",
            prezzo : 150,
            metodoTransazione : "Online"
        }
        const response = await request(process.env.START + "/").post("api/t/savet").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })


})

describe('Suite testing api endpoint "api/t/getAll"', () => {
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").get("api/t/getAll");
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
    })
})

describe('Suite testing api endpoint "api/t/gettp/{annuncio}"', () => {
    test("Chiamata all'API corretta con 'newAnnJestTransazione'", async () => {
        const response = await request(process.env.START + "/").get("api/t/gettp/newAnnJestTransazione")
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveLength(1);
    })
    test("Chiamata all'API con annuncio non esistente", async () => {
        const response = await request(process.env.START + "/").get("api/t/gettp/notExistingAnnuncioTrans")
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
    })
})

describe('Suite testing api endpoint "api/t/gettv/{venditore}"', () => {

    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").get("api/t/gettv/utentediprova");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").get("api/t/gettv/utentediprova").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    
    test("Chiamata all'API corretta con cercando le transazioni di 'utentediprova'", async () => {
        const response = await request(process.env.START + "/").get("api/t/gettv/utentediprova").set('x-access-token', token)
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveLength(1);
    })
    test("Chiamata all'API con utente che non ha fatto transazioni", async () => {
        const response = await request(process.env.START + "/").get("api/t/gettv/notExistingUser").set('x-access-token', token)
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
    })
})

describe('Suite testing api endpoint "api/t/getta/{acquirente}"', () => {

    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").get("api/t/getta/utentediprova");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").get("api/t/getta/utentediprova").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    
    test("Chiamata all'API corretta con cercando le transazioni di 'admin'", async () => {
        const response = await request(process.env.START + "/").get("api/t/getta/admin").set('x-access-token', token)
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
    })
    test("Chiamata all'API con utente che non ha fatto transazioni in entrata", async () => {
        const response = await request(process.env.START + "/").get("api/t/getta/utentediprova").set('x-access-token', token)
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
    })
})

describe('Suite testing api endpoint "api/t/deletet/{id}', () => {
    test("Chiamata all'API corretta", async () => {
        //ottengo l'id della transazione da eliminare
        const response1 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestTransazione")
        const response = await request(process.env.START + "/").delete("api/t/deletet/" + response1.body[0]._id);
        expect(response.statusCode).toEqual(204);
    })
    test("Chiamata all'API con un id transazione inesistente", async () => {
        const response = await request(process.env.START + "/").delete("api/t/deletet/aaaa");
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
    })
})