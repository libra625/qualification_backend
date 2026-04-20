const express = require('express');
const router = express.Router();

const Controller = require('../controllers/testResultController');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const cors = require("cors");


const corsOptions = {
    origin: 'http://localhost:5173',  // Разрешаем запросы с этого домена
    methods: ['GET', 'POST'],  // Разрешаем только GET-запросы
    credentials: true,  // Разрешаем отправку cookies
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
};

router.use(cors(corsOptions));
router.use(auth);

router.post('/', checkRole('teacher', 'student'), Controller.submitTest);

router.get('/', checkRole('psychologist'), Controller.getResult);

router.get('/pending', checkRole('teacher', 'student'), Controller.getPendingTests);

router.get('/detailed', checkRole('psychologist'), Controller.getDetailedResultFull);

router.get('/by-test', checkRole('psychologist'), Controller.getTestResultsByTestId);

module.exports = router;