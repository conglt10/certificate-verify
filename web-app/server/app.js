const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const checkJWT = require('./middlewares/check-jwt');

const app = express();

require('dotenv').config();

// API auth
const authRoutes = require('./routes/auth');

// API teacher
const teacherRoutes = require('./routes/teacher');

// API Subject
const subjectRoutes = require('./routes/subject');

// API student
const studentRoutes = require('./routes/student');

// API academy
const academyRoutes = require('./routes/academy');

// Connect database
mongoose.connect(
  process.env.MONGODB_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (error) => {
    if (error) console.log(error);
    else console.log('connection successful');
  }
);
mongoose.set('useCreateIndex', true);

// show log
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  require('express-session')({
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false
  })
);

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: '*', // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // allow session cookie from browser to pass through
  })
);

// Set up routes
app.use('/auth', authRoutes);
app.use('/student', checkJWT, studentRoutes);
app.use('/academy', checkJWT, academyRoutes);
app.use('/teacher', checkJWT, teacherRoutes);
app.use('/subject', checkJWT, subjectRoutes);

app.get('/', (req, res, next) => {
  res.json({ title: 'Hello' });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
