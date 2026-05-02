const express = require('express');
const cors = require('cors');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const timetableController = require('../controllers/timetableController')


const corsOptions = {
    origin: 'http://localhost:5173',  // Разрешаем запросы с этого домена
    methods: ['GET', 'POST'],  // Разрешаем только GET-запросы
    credentials: true,  // Разрешаем отправку cookies
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    // strict-origin-when-cross-origin: позволяет делать запросы с определенного источника,
    // если запрос сделан с другого источника.
};

router.use(cors(corsOptions));
router.use(auth);

// All allowed roles for viewing timetable
router.get('/get', checkRole('teacher', 'student', 'psychologist'), timetableController.getTimetable);

// Only psychologist can modify
router.post('/create', checkRole('psychologist'), timetableController.createTimetable);

router.put('/update/:id', checkRole('psychologist'), timetableController.updateTimetable);

module.exports = router;
