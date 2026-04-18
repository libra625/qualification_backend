const request = require('supertest');
const app = require('../app');

// Mock auth middleware
jest.mock('../middlewares/authMiddleware', () => {
    return (req, res, next) => {
        req.userId = 1;
        next();
    };
});

// Mock role middleware
jest.mock('../middlewares/roleMiddleware', () => {
    return () => (req, res, next) => next();
});

describe('Counseling API', () => {

    // ✅ CREATE counseling
    it('should create counseling', async () => {
        const res = await request(app)
            .post('/counseling')
            .send({
                problem: 'panic attack',
                date: '2026-04-18',
                electronic_card_id: 1,
                newDiagnosis: 'anxiety disorder',
                newRecommendation: 'therapy'
            });

        expect([200, 201]).toContain(res.statusCode);
    });

    // ❌ missing date
    it('should fail if date is missing', async () => {
        const res = await request(app)
            .post('/counseling')
            .send({
                problem: 'panic attack',
                electronic_card_id: 1,
                newDiagnosis: 'anxiety disorder',
                newRecommendation: 'therapy'
            });

        expect([400, 500]).toContain(res.statusCode);
    });

    // ✅ GET counseling by user
    it('should get counseling by user_id', async () => {
        const res = await request(app)
            .get('/counseling/1');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

});