const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userModel = require("../models/authModel");
const config = require('../config/config');

exports.register = async (email, password, name, surname, middleName, username, phone, parentsPhone, classLetter, classNumber) => {
    if (!email || !password || !name || !surname || !middleName || !username || !phone || !parentsPhone|| !classLetter|| !classNumber) {
        throw new Error("Empty data");
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
        const err = new Error("User already exists");
        err.status = 409;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.createUser(email, hashedPassword, name, surname, middleName, username, phone, parentsPhone, classLetter, classNumber);

    const token = jwt.sign(
        { userId: newUser.id },
        config.jwtSecret,
        { expiresIn: "1h" }
    );

    return {
        user: newUser,
        token,
    };
};

exports.login = async (email, password) => {
    if (!email || !password) {
        throw new Error("Email and password required");
    }
    const user = await userModel.findUserByEmail(email);
    if (!user) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    console.log(user)
    console.log(user.user_id)

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    const token = jwt.sign(
        { userId: user.user_id },
        config.jwtSecret,
        { expiresIn: "1h" }
    );

    return {
        user: {
            id: user.id,
            email: user.email,
        },
        token,
    };
};