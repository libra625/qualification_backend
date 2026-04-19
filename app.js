const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const authRouter = require('./routes/authRouter');
const timetableRouter = require('./routes/timetableRouter')
const consultationRouter = require('./routes/consultationRouter')
const complainRouter = require('./routes/complainRouter')
const counselingRouter = require('./routes/counselingRouter')
const adminRouter = require('./routes/adminRouter')

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', authRouter);
app.use('/timetable', timetableRouter);
app.use('/consultation', consultationRouter);
app.use('/complain', complainRouter);
app.use('/counseling', counselingRouter);
app.use('/admin', adminRouter);

app.on('listening', () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;
