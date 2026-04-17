const request = require("supertest");
const app = require("../app");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

describe("Timetable API", () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3NjQ0Nzc3NCwiZXhwIjoxNzc2NDUxMzc0fQ.f2CB069hMnNrWPPGP6Ww5ZcC9jzWni9oZc_niX80ryU';

    test("GET /timetable/get should return 200", async () => {
        const res = await request(app)
            .get("/timetable/get")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("data");
    });

    test("POST /timetable/create should fail without data", async () => {
        const res = await request(app)
            .post("/timetable/create")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(res.statusCode).toBe(400);
    });

    test("PUT /timetable/update should fail without id", async () => {
        const res = await request(app)
            .put("/timetable/update/999")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(res.statusCode).toBe(400);
    });

});