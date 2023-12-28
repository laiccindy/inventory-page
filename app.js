const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()

const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog')
const compression = require("compression");
const helmet = require("helmet");


var app = express();
const port = 8080;

const mongoose = require('mongoose')
// Set up mongoose connection

mongoose.set("strictQuery", false);
// Define the database URL to connect to.
const dev_db_url =
  "mongodb+srv://ginapertance:1aONBxZt8Uaf8Oct@cluster0.tn5m5sr.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.MONGO_URL || dev_db_url;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
// view engine setup
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression())
app.use(helmet());


app.use('/', indexRouter);
app.use('/catalog', catalogRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})

module.exports = app;