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
    const annuncio2 = {
        titolo : "newAnnJestProfiloAffitto",
        inserzionista : "utentediprova",
        descrizione : "Nuovo annuncio di prova per il testing con Jest per la transazione",
        modalitaTransazione : "Affitto",
        categoria : "sport",
        via : "via Sommarive 20",
        citta : "Povo",
        provincia : "Trento",
        prezzo : 150
    }
    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );
    const resp = await request(process.env.START + "/").post("api/a/savea").set('x-access-token', token).send(annuncio);
    const resp2 = await request(process.env.START + "/").post("api/a/savea").set('x-access-token', token).send(annuncio2);

    //creiamo una transazione (in cui il nostro utente è sia acquirente che venditore)
    //e una recensione associata

    const transazione = {
        venditore : "utentediprova",
        acquirente : "utentediprova",
        prodotto : "newAnnJestProfilo",
        prezzo : 150,
        metodoTransazione : "Online"
    }
    const response = await request(process.env.START + "/").post("api/t/savet").set('x-access-token', token).send(transazione);

    const transazione2 = {
        venditore : "utentediprova",
        acquirente : "utentediprova",
        prodotto : "newAnnJestProfiloAffitto",
        prezzo : 150,
        metodoTransazione : "Online"
    }
    await request(process.env.START + "/").post("api/t/savet").set('x-access-token', token).send(transazione2);


    const recensione = {
        utenteRecensito : "utentediprova",
        utenteRecensore : "utentediprova",
        transazioneRecensita : response.body._id,
        stelle : 3,
        descrizione : "Ottima!"
    }
    await request(process.env.START + "/").post("api/r/saver").set('x-access-token', token).send(recensione);
})

afterAll(async () => {
    const response1 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestProfilo")
    const response2 = await request(process.env.START + "/").get("api/t/gettp/newAnnJestProfiloAffitto")
    await request(process.env.START + "/").delete("api/t/deletet/" + response2.body[0]._id);
    await request(process.env.START + "/").delete("api/r/deleter/" + response1.body[0]._id).set('x-access-token', jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} ))
    await request(process.env.START + "/").delete("api/t/deletet/" + response1.body[0]._id);
    await request(process.env.START + "/").delete("api/a/deletea/newAnnJestProfiloAffitto")
    await request(process.env.START + "/").delete("api/a/deletea/newAnnJestProfilo")
    await request(process.env.START + "/").delete("api/u/deleteu/utentediprova").set('x-access-token',jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} ))
    mongoose.connection.close(true);
    server.close();
})

describe("Suite testing api endpoint /api/p/savep", () => {
    const inputBody = {
        idUtente : "utentediprova",
        descrizioneProfilo : "Prova con descrizione troppo lungaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
    test("Chiamata all'API con descrizione eccedente i 250 caratteri", async () => {
        const response = await request(process.env.START + "/").post("api/p/savep").send(inputBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
    test("Chiamata all'API corretta", async () => {
        inputBody.descrizioneProfilo = "Benvenuti nel mio nuovo profilo"
        const response = await request(process.env.START + "/").post("api/p/savep").send(inputBody);
        expect(response.statusCode).toEqual(201);
        expect(response.body._id).toEqual(inputBody.idUtente);
        expect(response.body.descrizioneProfilo).toEqual(inputBody.descrizioneProfilo);
    })
    test("Chiamata all'API con profilo già salvato per l'utente specificato", async () => {
        const response = await request(process.env.START + "/").post("api/p/savep").send(inputBody);
        expect(response.statusCode).toEqual(409);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
    test("Chiamata all'API con utente specificato non esistente", async () => {
        inputBody.idUtente = "nessunUtenteEsistente"
        const response = await request(process.env.START + "/").post("api/p/savep").send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
})

describe("Suite testing api endpoint /api/p/getAll", () => {
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").get("api/p/getAll");
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
    })
})

describe("Suite testing api endpoint /api/p/getbest", () => {
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").get("api/p/getbest");
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
    })
})

describe("Suite testing api endpoint /api/p/getp/{id}", () => {
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").get("api/p/getp/utentediprova");
        expect(response.body).toEqual(expect.any(Object));
        expect(response.statusCode).toEqual(200);
    })
    test("Chiamata all'API con profilo non esistente", async () => {
        const response = await request(process.env.START + "/").get("api/p/getp/profiloNonEsistente");
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
    })
})

describe('Suite testing api endpoint /api/p/updatep', () => {
    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").patch("api/p/updatep");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").patch("api/p/updatep").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    const inputBody = {
        id : "utentediprova",
        descrizioneProfilo : "Nuova prova con descrizione troppo lungaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }

    test("Chiamata all'API con descrizione troppo lunga", async () => {
        const response = await request(process.env.START + "/").patch("api/p/updatep").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual("Descrizione troppo lunga!");
    })

    test("Chiamata all'API corretta", async () => {
        inputBody.descrizioneProfilo = "Nuova descrizione corretta"
        const response = await request(process.env.START + "/").patch("api/p/updatep").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API profilo non esistente", async () => {
        inputBody.id = "profiloNonEsistente"
        const response = await request(process.env.START + "/").patch("api/p/updatep").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
})

describe('Suite testing api endpoint /api/p/addwl', () => {
    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").patch("api/p/addwl");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").patch("api/p/addwl").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    const inputBody = {
        id : "utentediprova",
        annuncio : "newAnnJestProfilo"
    }

    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").patch("api/p/addwl").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API con annuncio già in wish list", async () => {
        const response = await request(process.env.START + "/").patch("api/p/addwl").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(409);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API con annuncio non esistente", async () => {
        inputBody.annuncio = "annuncioCheNonEsiste"
        const response = await request(process.env.START + "/").patch("api/p/addwl").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API con utente non esistente", async () => {
        inputBody.annuncio = "newAnnJestProfilo"
        inputBody.id = "utenteCheNonEsiste!"
        const response = await request(process.env.START + "/").patch("api/p/addwl").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
    
})

describe('Suite testing api endpoint /api/p/rimuoviwl', () => {
    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").patch("api/p/rimuoviwl");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").patch("api/p/rimuoviwl").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    const inputBody = {
        id : "utentediprova",
        annuncio : "newAnnJestProfilo"
    }

    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").patch("api/p/rimuoviwl").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API con annuncio già assente dalla wish list", async () => {
        const response = await request(process.env.START + "/").patch("api/p/rimuoviwl").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(409);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API con annuncio non esistente", async () => {
        inputBody.annuncio = "annuncioCheNonEsiste"
        const response = await request(process.env.START + "/").patch("api/p/rimuoviwl").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API con utente non esistente", async () => {
        inputBody.annuncio = "newAnnJestProfilo"
        inputBody.id = "utenteCheNonEsiste!"
        const response = await request(process.env.START + "/").patch("api/p/rimuoviwl").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
    
})

describe('Suite testing api endpoint /api/p/updaterat', () => {
    const inputBody = {
        id : "utentediprova"
    }
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").patch('api/p/updaterat').send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
    test("Chiamata all'API con profilo inesistente", async () => {
        inputBody.id = "utenteCheNonEsiste"
        const response = await request(process.env.START + "/").patch('api/p/updaterat').send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
})

describe('Suite testing api endpoint /api/p/updateao', () => {
    const inputBody = {
        id : "utentediprova"
    }
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").patch('api/p/updateao').send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
    test("Chiamata all'API con profilo inesistente", async () => {
        inputBody.id = "utenteCheNonEsiste"
        const response = await request(process.env.START + "/").patch('api/p/updateao').send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
})

describe('Suite testing api endpoint /api/p/updatesv', () => {
    const inputBody = {
        id : "utentediprova"
    }
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").patch('api/p/updatesv').send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
    test("Chiamata all'API con profilo inesistente", async () => {
        inputBody.id = "utenteCheNonEsiste"
        const response = await request(process.env.START + "/").patch('api/p/updatesv').send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
})

describe('Suite testing api endpoint /api/p/updatesa', () => {
    const inputBody = {
        id : "utentediprova"
    }
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").patch('api/p/updatesa').send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
    test("Chiamata all'API con profilo inesistente", async () => {
        inputBody.id = "utenteCheNonEsiste"
        const response = await request(process.env.START + "/").patch('api/p/updatesa').send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
})

describe('Suite testing api endpoint /api/p/deletep/{id}', () => {
    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").delete("api/p/deletep/utentediprova");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").delete("api/p/deletep/utentediprova").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").delete("api/p/deletep/utentediprova").set('x-access-token', token);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API con profilo non esistente", async () => {
        const response = await request(process.env.START + "/").delete("api/p/deletep/profiloNonEsistente").set('x-access-token', token);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual("Profilo non presente!");
        expect(response.body.success).toEqual(false);
    })

})