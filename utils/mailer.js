// mailer.js
const config = require('../config/config');
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter once
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS, // Gmail App Password
    },
});

// Reusable sendMail function
const sendMail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"My App" єпсихолог`,
            to,
            subject,
            text,
        });

        console.log("Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Mail error:", error);
        throw error;
    }
};

module.exports = sendMail;