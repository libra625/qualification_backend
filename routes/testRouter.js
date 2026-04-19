const express = require('express');
const router = express.Router();

const TestController = require('../controllers/testController');
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
    // strict-origin-when-cross-origin: позволяет делать запросы с определенного источника,
    // если запрос сделан с другого источника.
};

router.use(cors(corsOptions));
router.use(auth);

// Create test
router.post('/', checkRole('psychologist'), TestController.createTest);

// Get all tests (summary)
router.get('/', checkRole('psychologist'), TestController.getAllTests);

// Get full test (nested questions + answers)
router.get('/:id', checkRole('teacher', 'student', 'psychologist'), TestController.getTestById);

// Update test
router.put('/tests/:id', checkRole('psychologist'), TestController.updateTest);

// Assign test to user
router.post('/tests/assign/user', checkRole('psychologist'), TestController.assignToUser);

// Assign test to class
router.post('/tests/assign/class', checkRole('psychologist'), TestController.assignToClass);

module.exports = router;