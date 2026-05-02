const router = require('express').Router();

const controller = require('../controllers/complainController');
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

// GET complains by user_id
router.get('/:user_id', checkRole('psychologist'), controller.getComplainsByUserId);

// CREATE complain
router.post('/', checkRole('psychologist'), controller.createComplain);

module.exports = router;