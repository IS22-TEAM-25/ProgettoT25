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

describe('Suite testing api endpoint "api/u/signUp"', () => {

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

    test("Chiamata all'API corretta", async() => {
        const response = await request(process.env.START + "/").post("api/u/signUp").send(inputBody);
        expect(response.statusCode).toEqual(201);
        expect(response.body._id).toEqual(inputBody.username);
        expect(response.body.nome).toEqual(inputBody.nome);
        expect(response.body.cognome).toEqual(inputBody.cognome);
        expect(response.body.indirizzo).toEqual(inputBody.indirizzo);
        expect(response.body.email).toEqual(inputBody.email);
        expect(response.body.password).toEqual(inputBody.password);
        expect(response.body.metodiPagamento).toEqual(inputBody.metodiPagamento);
        expect(response.body.bloccato).toEqual(false);
    })

    test("Chiamata all'API con mail già presa", async() => {
        const response = await request(process.env.START + "/").post("api/u/signUp").send(inputBody);
        expect(response.statusCode).toEqual(409);
        expect(response.body.message).toEqual('Utente già presente con questa mail!');
        expect(response.body.success).toEqual(false);
    })

    test("Chiamata all'API con username già preso", async() => {
        inputBody.email = "mailutentediprova2@gmail.com"
        const response = await request(process.env.START + "/").post("api/u/signUp").send(inputBody);
        expect(response.statusCode).toEqual(409);
        expect(response.body.message).toEqual('Username già preso!');
        expect(response.body.success).toEqual(false);
    })

})

describe('Suite testing api endpoint "api/u/getAll"', () => {

    test("Chiamata all'API corretta", async () => {
        const response = await request(process.env.START + "/").get("api/u/getAll");
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toEqual(200);
    })
})

describe('Suite testing api endpoint "api/u/getu/{username}"', () => {

    test("Chiamata all'API con utente esistente, si passa il parametro 'utentediprova'", async () => {
        const response = await request(process.env.START + "/").get("api/u/getu/utentediprova");
        expect(response.body).toEqual(expect.any(Object));
        expect(response.body.username).toEqual('utentediprova');
        expect((response.statusCode)).toEqual(200);
    })

    test("Chiamata all'API con utente non esistente, si passa il parametro 'utentenonesistente'", async () => {
        const response = await request(process.env.START + "/").get("api/u/getu/utentenonesistente");
        expect(response.body.message).toEqual('Utente non trovato!');
        expect(response.body.success).toEqual(false);
        expect(response.statusCode).toEqual(404);
    })
})

describe('Suite testing api endpoint "api/u/updateu"', () => {

    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").patch("api/u/updateu/utentediprova");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").patch("api/u/updateu/utentediprova").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'admin', id : 'admin'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    const inputBody = {
        username : "admin",
        nome : "GabrieleFedericoGiulio",
        cognome : "VolaniMenegozLoCigno",
        datadinascita : "1969-03-17",
        indirizzo : "via Sommarive 20, Povo, Trento",
        metodiPagamento : "spottythingsweb@gmail.com"
    };

    test("Chiamata all'API con utente esistente, si passa nel body 'admin'", async () => {
        const response = await request(process.env.START + "/").patch("api/u/updateu").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API con utente non esistente, si passa nel body 'utentenonesistente'", async () => {
        inputBody.username = "utentenonesistente"
        const response = await request(process.env.START + "/").patch("api/u/updateu").set('x-access-token', token).send(inputBody);
        expect(response.body.message).toEqual('Utente non trovato');
        expect(response.body.success).toEqual(false);
        expect(response.statusCode).toEqual(404);
    })
})

describe('Suite testing api endpoint "api/u/updatep"', () => {

    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").patch("api/u/updatep");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").patch("api/u/updatep").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    const inputBody = {
        username : 'utentediprova',
        password :  "utentediprova1!"
    };

    test("Chiamata all'API con utente esistente, si passa nel body 'utentediprova'", async () => {
        const response = await request(process.env.START + "/").patch("api/u/updatep").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API con utente non esistente, si passa nel body 'utentenonesistente'", async () => {
        inputBody.username = "utentenonesistente"
        const response = await request(process.env.START + "/").patch("api/u/updatep").set('x-access-token', token).send(inputBody);
        expect(response.body.message).toEqual('Utente non trovato');
        expect(response.body.success).toEqual(false);
        expect(response.statusCode).toEqual(404);
    })

})

describe('Suite testing api endpoint "api/u/updatee"', () => {

    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").patch("api/u/updatee");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").patch("api/u/updatee").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'admin', id : 'admin'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    const inputBody = {
        username : 'admin',
        email :  "spottythingsweb@gmail.com"
    };

    test("Chiamata all'API con utente esistente, si passa nel body 'admin', ma passando la mail già salvata", async () => {
        const response = await request(process.env.START + "/").patch("api/u/updatee").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.message).toEqual("Niente da modificare");
    })

    test("Chiamata all'API con utente non esistente, si passa nel body 'utentenonesistente'", async () => {
        inputBody.username = "utentenonesistente"
        const response = await request(process.env.START + "/").patch("api/u/updatee").set('x-access-token', token).send(inputBody);
        expect(response.body.message).toEqual('Utente non trovato');
        expect(response.body.success).toEqual(false);
        expect(response.statusCode).toEqual(404);
    })

    test("Chiamata all'API con utente esistente, si passa nel body 'utentediprova', ma con una mail già associata ad altri", async () => {
        inputBody.username = "utentediprova"
        const response = await request(process.env.START + "/").patch("api/u/updatee").set('x-access-token', token).send(inputBody);
        expect(response.body.message).toEqual('Email già usata');
        expect(response.body.success).toEqual(false);
        expect(response.statusCode).toEqual(409);
    })

    test("Chiamata all'API con utente esistente, si passa nel body 'utentediprova' e una mail valida", async () => {
        inputBody.username = "utentediprova"
        inputBody.email = "mailutentediprova2@gmail.com";
        const response = await request(process.env.START + "/").patch("api/u/updatee").set('x-access-token', token).send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

})

describe('Suite testing api endpoint "api/u/deleteu/{username}"', () => {

    test("Chiamata all'API senza token", async () => {
        const response = await request(process.env.START + "/").delete("api/u/deleteu/utentediprova");
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toEqual("Token non fornito");
    })

    test("Chiamata all'API con un token non valido", async () => {
        const response = await request(process.env.START + "/").delete("api/u/deleteu/utentediprova").set('x-access-token', "tokenNonValdio");
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toEqual("Token non valido!");
    })

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    test("Chiamata all'API con utente esistente, si passa il parametro 'utentediprova'", async () => {
        const response = await request(process.env.START + "/").delete("api/u/deleteu/utentediprova").set('x-access-token', token);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API con utente non esistente, si passa il parametro 'utentenonesistente'", async () => {
        const response = await request(process.env.START + "/").delete("api/u/deleteu/utentenonesistente").set('x-access-token', token);
        expect(response.body.message).toEqual('Utente non presente!');
        expect(response.body.success).toEqual(false);
        expect(response.statusCode).toEqual(404);
    })
})