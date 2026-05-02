const express = require('express');
const cors = require('cors');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const electronicCardController = require('../controllers/electronicCardController')


const corsOptions = {
    origin: 'http://localhost:5173',  // Разрешаем запросы с этого домена
    methods: ['GET', 'POST', 'PUT'],  // Разрешаем только GET-запросы
    credentials: true,  // Разрешаем отправку cookies
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
};

router.use(cors(corsOptions));
router.use(auth);
//psychologist
router.get("/", checkRole('psychologist'), electronicCardController.getAllCards);
router.get("/stats", checkRole('psychologist'), electronicCardController.getStatistics);
router.get("/:id", checkRole('psychologist'), electronicCardController.getCardById);
router.put("/:id", checkRole('psychologist'), electronicCardController.updateCard);

module.exports = router;