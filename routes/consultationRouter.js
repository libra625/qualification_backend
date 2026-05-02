const express = require('express');
const cors = require('cors');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const consultationController = require('../controllers/consultationController')


const corsOptions = {
    origin: 'http://localhost:5173',  // Разрешаем запросы с этого домена
    methods: ['GET', 'POST', 'PATCH'],  // Разрешаем только GET-запросы
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

// Request create consultation (user)
router.post('/create', checkRole('teacher', 'student'), consultationController.createConsultation);


// Get user pending consultations (from JWT)
router.get('/user/pending', checkRole('teacher', 'student'), consultationController.getUserPending);


// Get all pending consultations for psychologist (id = 1)
router.get('/psychologist/pending', checkRole('psychologist'), consultationController.getPsychologistPending);


// Mark consultation as happened (complete)
router.patch('/:id/complete', checkRole('psychologist'), consultationController.completeConsultation);

module.exports = router;