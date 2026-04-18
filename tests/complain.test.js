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

describe('Complain API', () => {

    // ✅ CREATE complain
    it('should create complain', async () => {
        const res = await request(app)
            .post('/complain')
            .send({
                problem: 'anxiety issue',
                date: '2026-04-18',
                electronic_card_id: 1,
                newDiagnosis: 'stress',
                newRecommendation: 'rest'
            });

        expect([200, 201]).toContain(res.statusCode);
    });

    // ❌ missing problem
    it('should fail if problem is missing', async () => {
        const res = await request(app)
            .post('/complain')
            .send({
                date: '2026-04-18',
                electronic_card_id: 1,
                newDiagnosis: 'stress',
                newRecommendation: 'rest'
            });

        expect([400, 500]).toContain(res.statusCode);
    });

    // ✅ GET complains by user
    it('should get complains by user_id', async () => {
        const res = await request(app)
            .get('/complain/1');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

});