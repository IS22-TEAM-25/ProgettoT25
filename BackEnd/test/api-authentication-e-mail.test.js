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

describe('Suite testing api endpoint "api/l/signIn"', () => {

    const inputBody = {
        username : "admin",
        password : "admin"
    };

    test("Chiamata all'API corretta", async() => {
        const response = await request(process.env.START + "/").post("api/l/signIn").send(inputBody);
        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.message).toEqual("Welcome on your account, " + inputBody.username + "!")
        expect(response.body.id).toEqual(inputBody.username)
    })

    test("Chiamata all'API con username non esistente", async() => {
        inputBody.username = "utentenonesistente"
        const response = await request(process.env.START + "/").post("api/l/signIn").send(inputBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual("Utente o password non corretti!")
    })

    test("Chiamata all'API con username esistente, ma password errata", async() => {
        inputBody.username = "admin"
        inputBody.password = "passworderrata"
        const response = await request(process.env.START + "/").post("api/l/signIn").send(inputBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual("Utente o password non corretti!")
    })

})

describe('Suite testing api endpoint "api/l/ripristino"', () => {

    const inputBody = {
        username : "admin"
    };

    test("Chiamata all'API corretta", async() => {
        const response = await request(process.env.START + "/").post("api/l/ripristino").send(inputBody);
        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.message).toEqual(expect.any(String));

        //ripristino della password per admin
        const ripristino = {
            username : "admin",
            password : "admin"
        }
        var token = jwt.sign( {username: 'admin', id : 'admin'}, process.env.SUPER_SECRET, {expiresIn: 23200} );
        const resp = await request(process.env.START + "/").patch("api/u/updatep").set('x-access-token',token).send(ripristino);
    })

    test("Chiamata all'API con username non esistente", async() => {
        inputBody.username = "utentenonesistente"
        const response = await request(process.env.START + "/").post("api/l/ripristino").send(inputBody);
        expect(response.statusCode).toEqual(404);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual("Nessun utente trovato");
    })

})

describe('Suite testing api endpoint "api/l/logout"', () => {

    var token = jwt.sign( {username: 'admin', id : 'admin'}, process.env.SUPER_SECRET, {expiresIn: 23200} );

    test("Chiamata all'API corretta", async() => {
        const response = await request(process.env.START + "/").get("api/l/logout").set('x-access-token', token);
        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.message).toEqual("You logged out!");
    })

    test("Chiamata all'API senza token", async() => {
        const response = await request(process.env.START + "/").get("api/l/logout");
        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.message).toEqual("You alreayd logged out!");
    })

})

describe('Suite testing api endpoint "api/m/sendEmail"', () => {

    const inputBody = {
        toAddress : 'spottythingsweb@gmail.com',
        subj : 'Email per il testing con Jest',
        message : 'Email di prova, inviato eseguendo il comando "npm test" che effettua il testing'
    }

    test("Chiamata all'API corretta", async() => {
        const response = await request(process.env.START + "/").post("api/m/sendEmail").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API senza specificare un indirizzo mail destinazione", async() => {
        inputBody.toAddress = undefined;
        const response = await request(process.env.START + "/").post("api/m/sendEmail").send(inputBody);
        expect(response.statusCode).toEqual(500);
        expect(response.body.success).toEqual(false);
        expect(response.body.Error).toEqual(expect.any(Object));
    })

})