const express = require('express');
const expressLayout = require('express-ejs-layouts');
const app = express();
const port = 8080;
const ejs = require('ejs');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/public'));

// Templating engine
app.use(expressLayout);
app.set('layout', './pages/main');
app.set('view engine', 'ejs')

// Routes
app.use('/', require('./routes/song'));


// MongoDB and Mongoose
const mongoose = require("mongoose");
const dbUrl = "mongodb+srv://clusterzerouser:cx0eUnQlGl5YLj28@cluster0.tn5m5sr.mongodb.net/songsDB?retryWrites=true&w=majority";
const connectionParams = {
   useNewUrlParser: true,
   useUnifiedTopology: true
};

mongoose
  .connect(dbUrl, connectionParams)
  .then( () => {
	  console.info("Connected to database");
  })
  .catch( (err) => 
  {
	  console.info("Error trying to Connect to database", err);
  });
  
mongoose.set('strictQuery', true);

app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})