const authService = require("../services/authServices");

exports.register = async (req, res) => {
    try {
        const { email, password, name, surname, middleName, username, phone, parentsPhone, classLetter, classNumber } = req.body;

        const result = await authService.register(email, password, name, surname, middleName, username, phone, parentsPhone, classLetter, classNumber );

        res.status(201).json({
            message: "User registered",
            ...result,
        });
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.json({
            message: "Login successful",
            ...result,
        });
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error",
        });
    }
};