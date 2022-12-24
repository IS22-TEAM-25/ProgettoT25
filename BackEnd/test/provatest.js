const request = require('supertest');
const app = require('../app');

describe('prova', () => {
    test("dovrebbe darmi un 200", async () => {
        const response = await request("http://localhost:8080/").get("api/t/getAll");
        expect((response.body)).toEqual(expect.any(Object));
        expect((response.statusCode)).toEqual(200);
    })
    test("dovrebbe darmi un 200", async () => {
        const response = await request("http://localhost:8080/").get("api/t/gettv/ha");
        expect((response.body)).toEqual(expect.any(Object));
        expect((response.statusCode)).toEqual(401);
    })
    test("dovrebbe darmi un 200", async () => {
        const response = await request("http://localhost:8080/").get("api/t/getta/k");
        expect((response.body)).toEqual(expect.any(Object));
        expect((response.statusCode)).toEqual(401);
    })
    test("dovrebbe darmi un 200", async () => {
        const response = await request("http://localhost:8080/").get("api/t/gettp/p");
        expect((response.body)).toEqual(expect.any(Object));
        expect((response.statusCode)).toEqual(404);
    })
    test("dovrebbe darmi un 200", async () => {
        const response = await request("http://localhost:8080/").delete("api/t/deletet/p");
        expect((response.body)).toEqual(expect.any(Object));
        expect((response.statusCode)).toEqual(404);
    })
    test("dovrebbe darmi un 200", async () => {
        const response = await request("http://localhost:8080/").post("api/t/savet");
        expect((response.body)).toEqual(expect.any(Object));
        expect((response.statusCode)).toEqual(401);
    })
    test("dovrebbe darmi un 200", async () => {
        const response = await request("http://localhost:8080/").get("api/a/getAll");
        expect((response.body)).toEqual(expect.any(Object));
        expect((response.statusCode)).toEqual(200);
    })
})