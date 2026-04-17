const express = require('express');
const cors = require('cors');
const router = express.Router();
const authController = require('../controllers/authController')

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

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
