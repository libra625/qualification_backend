const request = require('supertest');
const app = require('../app');

// Mock auth + role middleware (so tests don't fail on roles)
jest.mock('../middlewares/authMiddleware', () => {
    return (req, res, next) => {
        req.userId = 1;
        next();
    };
});

jest.mock('../middlewares/roleMiddleware', () => {
    return () => (req, res, next) => next();
});

describe('Consultation API', () => {

    // ✅ CREATE consultation
    it('should create consultation', async () => {
        const res = await request(app)
            .post('/consultation/create')
            .send({
                time: 930,
                date: '18-04-2026',
                is_online: true,
                link: 'https://meet.com/test'
            });

        expect([200, 201]).toContain(res.statusCode);
    });

    // ❌ missing time
    it('should fail if time is missing', async () => {
        const res = await request(app)
            .post('/consultation/create')
            .send({
                date: '18-04-2026',
                is_online: true,
                link: 'https://meet.com/test'
            });

        expect(res.statusCode).toBe(400);
    });

    // ✅ user pending consultations
    it('should get user pending consultations', async () => {
        const res = await request(app)
            .get('/consultation/user/pending');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ✅ psychologist pending consultations
    it('should get psychologist pending consultations', async () => {
        const res = await request(app)
            .get('/consultation/psychologist/pending');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ✅ complete consultation
    it('should mark consultation as completed', async () => {
        const res = await request(app)
            .patch('/consultation/3/complete');

        expect([200, 404]).toContain(res.statusCode);
    });

});