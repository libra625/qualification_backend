const service = require('../services/adminServices');

// helper
const isEmpty = (value) =>
    value === undefined || value === null || value === '';

// =========================
// CREATE USER
// =========================
exports.createUser = async (req, res) => {
    try {
        const {
            username,
            password,
            role,
            mail
        } = req.body;

        // required fields
        if (isEmpty(username) || isEmpty(password) || isEmpty(role)) {
            return res.status(400).json({
                message: 'username, password and role are required'
            });
        }

        // optional but if provided → must not be empty
        if (mail !== undefined && isEmpty(mail)) {
            return res.status(400).json({
                message: 'mail cannot be empty'
            });
        }

        const user = await service.createUser(req.body);

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =========================
// GET ALL USERS
// =========================
exports.getUsers = async (req, res) => {
    try {
        const users = await service.getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =========================
// GET ONE USER
// =========================
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user_id' });
        }

        const user = await service.getUser(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =========================
// UPDATE USER
// =========================
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user_id' });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: 'No data provided for update'
            });
        }

        // prevent empty values
        for (const key in req.body) {
            if (isEmpty(req.body[key])) {
                return res.status(400).json({
                    message: `${key} cannot be empty`
                });
            }
        }

        const user = await service.updateUser(id, req.body);

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =========================
// DELETE (SOFT DELETE)
// =========================
exports.disableUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user_id' });
        }

        const user = await service.disableUser(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User disabled', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = await service.getStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};