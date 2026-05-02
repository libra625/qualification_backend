const router = require('express').Router();

const controller = require('../controllers/counselingController');
const cors = require("cors");
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

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

// GET counseling by user_id
router.get('/:user_id', checkRole('psychologist'), controller.getCounselingByUserId);

// CREATE counseling
router.post( '/', checkRole('psychologist'), controller.createCounseling);

module.exports = router;