const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const authRouter = require('./routes/authRouter');
const timetableRouter = require('./routes/timetableRouter')

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', authRouter);
app.use('/timetable', timetableRouter);

app.on('listening', () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;
