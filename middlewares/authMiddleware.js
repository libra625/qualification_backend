const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {decode} = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // Очікується, що токен у заголовку "Authorization" у форматі "Bearer <token>"
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Токен не надано' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
        return res.status(401).json({ message: 'Невірний формат токену' });
    }

    const token = parts[1];

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Невірний токен' });
        }
        req.userId = decoded.userId;

        const remainingTokenTime = decoded.exp - Math.floor(Date.now() / 1000);

        if (remainingTokenTime < 10 * 60) {
            const token = jwt.sign({ userId: decoded.id }, config.jwtSecret, { expiresIn: '1h' })
            res.setHeader('authorization', `Bearer ${token}`);
        }
        next();
    });
};
