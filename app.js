const express = require('express');
const path = require('path');
const logger = require('morgan');

const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog')

const app = express()
const port = 8080;
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')

// Set up mongoose connection

mongoose.set("strictQuery", false);
// Define the database URL to connect to.
const dev_db_url =
  "mongodb+srv://ginapertance:KwAdPZCl2MmloVgd@cluster0.tn5m5sr.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.MONGO_URL || dev_db_url;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/catalog', catalogRouter)


app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})

module.exports = app;