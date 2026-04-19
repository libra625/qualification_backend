const request = require('supertest');
const app = require('../app');

// =========================
// MOCK AUTH
// =========================
jest.mock('../middlewares/authMiddleware', () => {
    return (req, res, next) => {
        req.userId = 1;
        next();
    };
});

jest.mock('../middlewares/roleMiddleware', () => {
    return () => (req, res, next) => next();
});

describe('Admin Users API', () => {

    // =========================
    // CREATE USER
    // =========================
    it('should create user', async () => {
        const res = await request(app)
            .post('/admin/users')
            .send({
                surname: 'Ivanov',
                name: 'Ivan',
                middle_name: 'Ivanovich',
                username: 'ivan_test',
                password: '123456',
                mail: 'ivan@test.com',
                phone: '+380501111111',
                parents_phone: '+380502222222',
                role: 'student',
                class_number: 10,
                class_letter: 'A'
            });

        expect([200, 201]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('user_id');
    });

    // =========================
    // FAIL CREATE (missing data)
    // =========================
    it('should fail when required fields missing', async () => {
        const res = await request(app)
            .post('/admin/users')
            .send({
                name: 'Ivan'
            });

        expect([400, 500]).toContain(res.statusCode);
    });

    // =========================
    // GET ALL USERS
    // =========================
    it('should get all users', async () => {
        const res = await request(app)
            .get('/admin/users');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // =========================
    // GET SINGLE USER
    // =========================
    it('should get user by id', async () => {
        const res = await request(app)
            .get('/admin/users/1');

        expect([200, 404]).toContain(res.statusCode);
    });

    // =========================
    // UPDATE USER
    // =========================
    it('should update user', async () => {
        const res = await request(app)
            .put('/admin/users/1')
            .send({
                name: 'UpdatedName',
                phone: '+380500000000',
                class_number: 11,
                class_letter: 'B'
            });

        expect([200, 201]).toContain(res.statusCode);
    });

    // =========================
    // DISABLE USER (soft delete)
    // =========================
    it('should disable user', async () => {
        const res = await request(app)
            .delete('/admin/users/1');

        expect([200, 201]).toContain(res.statusCode);
    });

});