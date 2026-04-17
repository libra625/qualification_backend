const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const authRouter = require('./routes/authRouter');
const cors = require("cors");

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', authRouter);
app.use('/tests', productsRouter);
app.use('/testing', categoriesRouter);

app.on('listening', () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;
