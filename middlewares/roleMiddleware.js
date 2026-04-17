const pool = require('../utils/db'); // your pg pool

module.exports = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.userId) {
                return res.status(401).json({ message: 'Не авторизований' });
            }

            const result = await pool.query(
                'SELECT role FROM users WHERE id = $1',
                [req.userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Користувача не знайдено' });
            }

            const userRole = result.rows[0].role;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: 'Доступ заборонено' });
            }

            next();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Помилка сервера' });
        }
    };
};