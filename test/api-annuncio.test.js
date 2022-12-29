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
})

afterAll(() => {
    mongoose.connection.close(true);
    server.close();
})

describe('Suite testing api endpoint "api/a/savea"', () => {
    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").post("api/a/savea");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").post("api/a/savea").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'admin', id : 'admin'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    const inputBody = {
        titolo : "nuovoAnnuncioTestJestVendita",
        inserzionista : "admin",
        descrizione : "Nuovo annuncio di prova per il testing con Jest",
        modalitaTransazione : "Vendita",
        categoria : "sport",
        via : "via Sommarive 20",
        citta : "Povo",
        provincia : "Trento",
        pagamentoOnline : "true",
        prezzo : 150
    }

    test("Chiamata all'API con campo pagamentoOnline abilitato, ma contoPayPal non specificato", async () => {
        const response = await request(process.env.START + "/").post("api/a/savea").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API corretta di un annuncio in vendita", async () => {
        inputBody.contoPayPal = "provaPagamentoOnline@gmail.com"
        const response = await request(process.env.START + "/").post("api/a/savea").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(201);

        expect(response.body.titolo).toEqual(inputBody.titolo);
        expect(response.body._id).toEqual(inputBody.titolo);
        expect(response.body.inserzionista).toEqual(inputBody.inserzionista);
        expect(JSON.parse(response.body.indirizzoRitiro)).toEqual(expect.any(Object));
        expect(response.body.descrizione).toEqual(inputBody.descrizione);
        expect(response.body.categoria).toEqual(inputBody.categoria);
        expect(response.body.contoPayPal).toEqual(inputBody.contoPayPal);
    })

    const inputBody2 = {
        titolo : "nuovoAnnuncioTestJestAffitto",
        inserzionista : "admin",
        descrizione : "Nuovo annuncio in affitto di prova per il testing con Jest",
        modalitaTransazione : "Affitto",
        categoria : "sport",
        via : "via Sommarive 20",
        citta : "Povo",
        provincia : "Trento",
        pagamentoOnline : "false",
        prezzoAffittoAlGiorno : 10,
        prezzoAffittoSettimanale : 50,
        prezzoAffittoAllOra : 5
    }

    test("Chiamata all'API corretta di un annuncio in affitto", async () => {
        const response = await request(process.env.START + "/").post("api/a/savea").set('x-access-token', token).send(inputBody2);
        expect(response.statusCode).toEqual(201);

        expect(response.body.titolo).toEqual(inputBody2.titolo);
        expect(response.body._id).toEqual(inputBody2.titolo);
        expect(response.body.inserzionista).toEqual(inputBody2.inserzionista);
        expect(JSON.parse(response.body.indirizzoRitiro)).toEqual(expect.any(Object));
        expect(response.body.descrizione).toEqual(inputBody2.descrizione);
        expect(response.body.categoria).toEqual(inputBody2.categoria);
        expect(response.body.contoPayPal).toEqual(inputBody2.contoPayPal);
    })

    test("Chiamata all'API con titolo già presente", async () => {
        const response = await request(process.env.START + "/").post("api/a/savea").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(409);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API con inserzionista non esistente", async () => {
        inputBody.titolo = "nuovoAnnuncioTestJestNuovoAnnuncio"
        inputBody.inserzionista = "usernameInserzionistaNonEsistente"
        const response = await request(process.env.START + "/").post("api/a/savea").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

})

describe('Suite testing api endpoint /api/a/getAll', () => {
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").get("api/a/getAll");
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
    })
})

describe('Suite testing api endpoint /api/a/geti/{id}', () => {
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").get("api/a/geti/nuovoAnnuncioTestJestVendita");
        expect(response.body).toEqual(expect.any(Object));
        expect(response.statusCode).toEqual(200);
    })
    test("Chiamata all'API con un annuncio inesistente", async () => {
        const response = await request(process.env.START + "/").get("api/a/geti/nuovoAnnuncioTestJestNonEsistente");
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
    })
})

describe('Suite testing api endpoint /api/a/getau/{inserzionista}', () => {
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").get("api/a/getau/admin");
        expect(response.body).toEqual(expect.any(Object));
        expect(response.statusCode).toEqual(200);
    })
    test("Chiamata all'API con un inserzionista non esistente", async () => {
        const response = await request(process.env.START + "/").get("api/a/getau/usernameInserzionistaNonEsistente");
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
    })
    test("Chiamata all'API con un inserzionista che non ha annunci", async () => {
        //Creaimo subito un nuovo utente per lo scopo del testing
        const inputBody = {
            username : "utentediprova",
            nome : "Mario",
            cognome : "Rossi",
            datadinascita : "2002-02-17",
            indirizzo : "via Roma 12, Povo, Trento",
            email : "mailutentediprova@gmail.com",
            password : "prova123!",
            metodiPagamento : "utentediprovapagamenti@gmail.com"
        };
    
        await request(process.env.START + "/").post("api/u/signUp").send(inputBody);
    
        const response = await request(process.env.START + "/").get("api/a/getau/utentediprova");
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);

        //eliminiamo l'utente creato per scopi di testing
        var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );
        await request(process.env.START + "/").delete("api/u/deleteu/utentediprova").set('x-access-token', token);
    })
})

describe('Suite testing api endpoint /api/a/getkt/{word}', () => {
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").get("api/a/getkt/Jest");
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.body).toHaveLength(2);
        expect(response.statusCode).toEqual(200);
    })
    test("Chiamata all'API con keyword non corrispondente", async () => {
        const response = await request(process.env.START + "/").get("api/a/getkt/KeyWordNonCorrispondente");
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
    })
})

describe('Suite testing api endpoint /api/a/updatea', () => {    
    
    test("Chiamata all'API senza token", async () => {
    const response = await request(process.env.START + "/").patch("api/a/updatea");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").patch("api/a/updatea").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'admin', id : 'admin'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    const inputBody = {
        titolo : "nuovoAnnuncioTestJestAffitto",
        descrizione : "Nuovo annuncio in affitto di prova per il testing con Jest - descrizione modificata",
        categoria : "hobby",
        pagamentoOnline : "true",
        via : "via Roma 12",
        citta : "Trento",
        provincia : "Trento"
    }

    test("con campo pagamentoOnline abilitato, ma contoPayPal non specificato", async () => {
        const response = await request(process.env.START + "/").patch("api/a/updatea").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })

    test("Chiamata all'API corretta", async () => {
        inputBody.contoPayPal = "contospecificato@gmail.com"
        const response = await request(process.env.START + "/").patch("api/a/updatea").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API con annuncio non esistente", async () => {
        inputBody.titolo = "NessunAnnuncioConQuestoTitolo"
        const response = await request(process.env.START + "/").patch("api/a/updatea").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
})

describe('Suite testing api endpoint /api/a/getaf', () => {
    const inputBody = {
        categoria : "sport"
    }
    test("Chiamata all'API corretta - filtri: categoria = 'sport'", async () => {
        const response = await request(process.env.START + "/").post("api/a/getaf").send(inputBody);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
    })
    test("Chiamata all'API corretta - filtri: categoria = 'hobby', prezzo > 0", async () => {
        inputBody.categoria = "hobby",
        inputBody.startPrice = 0
        const response = await request(process.env.START + "/").post("api/a/getaf").send(inputBody);;
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
    })
    test("Chiamata all'API corretta - filtri: categoria = 'sport'", async () => {
        const response = await request(process.env.START + "/").post("api/a/getaf").send(inputBody);;
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
    })
    test("Chiamata all'API corretta - filtri: prezzo tra 0 e 1000000", async () => {
        inputBody.startPrice = 0
        inputBody.endPrice = 1000000
        const response = await request(process.env.START + "/").post("api/a/getaf").send(inputBody);;
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
    })
    test("Chiamata all'API senza risultati - filtri: citta : 'CittaNonEsistente404'", async () => {
        inputBody.categoria = undefined;
        inputBody.startPrice = undefined;
        inputBody.endPrice = undefined;
        inputBody.citta = 'CittaNonEsistente404';
        const response = await request(process.env.START + "/").post("api/a/getaf").send(inputBody);;
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
    })
})

describe('Suite testing api endpoint /api/a/ordina/{p}', () => {
    const inputBody = {
        arrayAnnunci : 
        [
            {
                titolo : "nuovoAnnuncioTestJestVendita",
                inserzionista : "admin",
                descrizione : "Nuovo annuncio di prova per il testing con Jest",
                modalitaTransazione : "Vendita",
                categoria : "sport",
                via : "via Sommarive 20",
                citta : "Povo",
                provincia : "Trento",
                pagamentoOnline : "true",
                contoPayPal : "nuovoAnnuncio@gmail.com",
                prezzo : 150
            }            
        ]   
    }
    
    test("Chiamata all'API corretta con p = 'd1'", async () => {
        const response = await request(process.env.START + "/").post("api/a/ordina/d1").send(inputBody);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
    })
    test("Chiamata all'API corretta con p = 'd2'", async () => {
        const response = await request(process.env.START + "/").post("api/a/ordina/d2").send(inputBody);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));

    })
    test("Chiamata all'API corretta con p = 'm1'", async () => {
        const response = await request(process.env.START + "/").post("api/a/ordina/m1").send(inputBody);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));

    })
    test("Chiamata all'API corretta con p = 'm2'", async () => {
        const response = await request(process.env.START + "/").post("api/a/ordina/m2").send(inputBody);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
    })
    test("Chiamata all'API con p non valido, p = 'pnonvalido'", async () => {
        const response = await request(process.env.START + "/").post("api/a/ordina/pnonvalido").send(inputBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual("Specificare ordinamento");
    })
})

describe('Suite testing api endpoint /api/a/deletea/{id}', () => {
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").delete("api/a/deletea/nuovoAnnuncioTestJestVendita");
        expect(response.statusCode).toEqual(204);
    })
    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").delete("api/a/deletea/nuovoAnnuncioTestJestAffitto");
        expect(response.statusCode).toEqual(204);
    })
    test("Chiamata all'API con un annuncio inesistente", async () => {
        const response = await request(process.env.START + "/").delete("api/a/deletea/nuovoAnnuncioTestJestNonEsistente");
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.statusCode).toEqual(404);
    })
})