const request = require('supertest');
// const app = require("./src/server");
// const app = require("./index");
// const app = require("./old-server");

module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js']
}

jest.setTimeout(30000)

describe('Suite prova api', () => {
    test('tests /api/a/getAll endpoints', async () => {
        const response = await request('http://localhost:8080/').get("api/u/getAll");
        // const response = await request(app).get("api/a/getAll");   
        // console.log(response.body)
        expect(response.statusCode).toBe(200);
    });
});

// const funzioni = require("../src/auxiliaries/checks");
// const { JsonWebTokenError } = require('jsonwebtoken');

// describe('Suite prova funzioni di controllo', () => {
//     test('Test checkPw', () => {
//         expect(funzioni.checkPw('pippo')).toBe(false);
//         expect(funzioni.checkPw('pippo111')).toBe(false);
//         expect(funzioni.checkPw('pippo!')).toBe(false);
//         expect(funzioni.checkPw('pippoooo!!')).toBe(true);

//     })
//     test('Test checkEmail', () => {
//         expect(funzioni.validateEmail('pippo')).toBe(null);
//         expect(funzioni.validateEmail('pippo111@hotail.it@')).toBe(null);
//         expect(funzioni.validateEmail('pippo@mail.com')).toEqual(expect.arrayContaining([expect.any(String)]));
//     })
//     test('Test validateEmail', () => {
//         expect(funzioni.validateEmail('pippo')).toBe(null);
//         expect(funzioni.validateEmail('pippo111@hotail.it@')).toBe(null);
//         expect(funzioni.validateEmail('pippo@mail.com')).toEqual(expect.arrayContaining([expect.any(String)]));
//     })
//     test('Test validateDate', () => {
//         expect(funzioni.validateDate('2022-17-02')).toBe(null);
//         expect(funzioni.validateDate('17-02-2002')).toEqual(expect.arrayContaining([expect.any(String)]));
//         expect(funzioni.validateDate('aa-c0-2002')).toBe(null);
//     })
// })