const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
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

// POST admin
router.post('/users', checkRole('admin'), controller.createUser);

// GET all
router.get('/users', checkRole('admin', 'psychologist'), controller.getUsers);

// GET one
router.get('/users/:id', checkRole('admin', 'psychologist'), controller.getUser);

// UPDATE
router.put('/users/:id', checkRole('admin'), controller.updateUser);

// DELETE
router.delete('/users/:id', checkRole('admin'), controller.disableUser);

// GET /admin/stats
router.get('/stats', checkRole('admin', 'psychologist'), controller.getStats);

module.exports = router;