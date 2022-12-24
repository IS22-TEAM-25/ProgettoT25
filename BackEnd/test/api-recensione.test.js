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
    //Creiamo la transazione per la recensione
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
    const transazione = {
        venditore : "utentediprova",
        acquirente : "admin",
        prodotto : "newAnnJestTransazione",
        prezzo : 150,
        metodoTransazione : "Online"
    }
    const response = await request(process.env.START + "/").post("api/t/savet").set('x-access-token', token).send(transazione);
})

afterAll( async () => {
    const response1 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestTransazione")
    await request(process.env.START + "/").delete("api/t/deletet/" + response1.body[0]._id);
    await request(process.env.START + "/").delete("api/a/deletea/newAnnJestTransazione")
    await request(process.env.START + "/").delete("api/u/deleteu/utentediprova").set('x-access-token',jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} ))
    mongoose.connection.close(true);
    server.close();
})

describe('Suite testing api endpoint "api/r/saver"', () => {
    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").post("api/r/saver");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").post("api/r/saver").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    test("Chiamata all'API mal formulata (8 stelle)", async () => {
        const response1 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestTransazione")
        const inputBody = {
            utenteRecensito : "utentediprova",
            utenteRecensore : "admin",
            transazioneRecensita : response1.body[0]._id,
            stelle : 8,
            descrizione : "Ottima!"
        }
        const response = await request(process.env.START + "/").post("api/r/saver").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API mal formulata (-1 stelle)", async () => {
        const response1 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestTransazione")
        const inputBody = {
            utenteRecensito : "utentediprova",
            utenteRecensore : "admin",
            transazioneRecensita : response1.body[0]._id,
            stelle : -1,
            descrizione : "Ottima!",
            dataRecensione : "dataMalFormulata"
        }
        const response = await request(process.env.START + "/").post("api/r/saver").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API scorretta: utenti e transazione non coincidenti", async () => {
        const response1 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestTransazione")
        const inputBody = {
            utenteRecensito : "admin",
            utenteRecensore : "admin",
            transazioneRecensita : response1.body[0]._id,
            stelle : 3,
            descrizione : "Ottima!"
        }
        const response = await request(process.env.START + "/").post("api/r/saver").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API corretta", async () => {
        const response1 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestTransazione")
        const inputBody = {
            utenteRecensito : "utentediprova",
            utenteRecensore : "admin",
            transazioneRecensita : response1.body[0]._id,
            stelle : 3,
            descrizione : "Ottima!",
            dataRecensione: "2022-12-24"
        }
        const response = await request(process.env.START + "/").post("api/r/saver").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(201);
        expect(response.body.utenteRecensito).toEqual(inputBody.utenteRecensito);
        expect(response.body.utenteRecensore).toEqual(inputBody.utenteRecensore);
        expect(response.body._id).toEqual(inputBody.transazioneRecensita);
        expect(response.body.transazioneRecensita).toEqual(inputBody.transazioneRecensita);
        expect(response.body.stelle).toEqual(inputBody.stelle);
        expect(response.body.descrizione).toEqual(inputBody.descrizione);

    })

    test("Chiamata all'API scorretta: recensione già salvata per una transazione", async () => {
        const response1 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestTransazione")
        const inputBody = {
            utenteRecensito : "utentediprova",
            utenteRecensore : "admin",
            transazioneRecensita : response1.body[0]._id,
            stelle : 3,
            descrizione : "Ottima!"
        }
        const response = await request(process.env.START + "/").post("api/r/saver").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(409);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API scorretta: transazione non esistente", async () => {
        const inputBody = {
            utenteRecensito : "utentediprova",
            utenteRecensore : "admin",
            transazioneRecensita : "idNonEsistente",
            stelle : 3,
            descrizione : "Ottima!"
        }
        const response = await request(process.env.START + "/").post("api/r/saver").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

})

describe('Suite testing api endpoint "api/r/getAll"', () => {
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").get("api/r/getAll");
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
    })
})

describe('Suite testing api endpoint "api/r/getrt/{transazione}"', () => {
    test("Chiamata all'API corretta", async () => {
        const response1 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestTransazione")
        const response = await request(process.env.START + "/").get("api/r/getrt/" + response1.body[0]._id)
        expect(response.body).toEqual(expect.any(Object));
        expect(response.statusCode).toEqual(200);
    })
    test("Chiamata all'API con transazione non esistente", async () => {
        const response = await request(process.env.START + "/").get("api/r/getrt/notExistingTransation")
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
    })
})

describe('Suite testing api endpoint "api/r/getrv/{recensito}"', () => {

     
    test("Chiamata all'API corretta con cercando le recensioni su 'utentediprova'", async () => {
        const response = await request(process.env.START + "/").get("api/r/getrv/utentediprova")
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveLength(1);
    })
    test("Chiamata all'API con utente che non ha fatto transazioni", async () => {
        const response = await request(process.env.START + "/").get("api/r/getrv/notExistingUser")
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
    })
})

describe('Suite testing api endpoint "api/r/getra/{recensore}"', () => {

    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").get("api/r/getra/utentediprova");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").get("api/r/getra/utentediprova").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    
    test("Chiamata all'API corretta con cercando le recensioni di 'admin'", async () => {
        const response = await request(process.env.START + "/").get("api/r/getra/admin").set('x-access-token', token)
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
    })
    test("Chiamata all'API con utente che non ha fatto recensioni su nessuno", async () => {
        const response = await request(process.env.START + "/").get("api/r/getra/utentediprova").set('x-access-token', token)
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
    })
})

describe('Suite testing api endpoint "api/r/deleter/{id}', () => {
    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").delete("api/r/deleter/id");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").delete("api/r/deleter/id").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    test("Chiamata all'API corretta", async () => {
        //ottengo l'id della recensione da eliminare
        const response1 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestTransazione")
        const response = await request(process.env.START + "/").delete("api/r/deleter/" + response1.body[0]._id).set('x-access-token', token);
        expect(response.statusCode).toEqual(204);
    })
    test("Chiamata all'API con un id recensione inesistente", async () => {
        const response = await request(process.env.START + "/").delete("api/r/deleter/aaaa").set('x-access-token', token);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
    })
})