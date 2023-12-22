const express = require('express');
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs')

// Connect to MongoDB
const mongoAtlas = 'mongodb+srv://ginapertance:fOyzpR8GnAaBKMbg@cluster0.tn5m5sr.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoAtlas, { useNewUrlPaser: true, useUnifiedTopology: true });

// Database model

const gameModel = mongoose.model('Game', {
  title: String,
  platform: String,
  genre: String,
  releaseDate: Date,
});

app.use(bodyParser.json());


app.post('/games', async (req,res)=> {
  const { title, platform, genre, releaseDate } =  req.body;
  const game = new gameModel({ title, platform, genre, releaseDate });

  try {
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


app.get('/games/', async (req, res)=>{
  try {
    const games = await gameModel.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/games/:id', async (req,res)=>{
  const gameId  =  req.params.id;

  try {
    const game = await gameModel.findById(gameId);
    if(!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/games/:id', async (req,res)=>{
  const gameId = req.params.id;
  const { title, platform, genre, releaseDate } = req.body;

  try {
    const game = await gameModel.findByIdAndUpdate(gameId, { title, platform, genre, releaseDate }, { new: true});
    if(!game)   {
      return res.status(40).json({ error: 'Game not found'});
    }
    res.json(game);
  } catch(error) {
    res.status(500).json({ error: 'Internal Server Error '});
  }
});


app.delete('/games/:id', async (req,res)=> {
  const gameId = req.params.id;

  try {
    const game = await Gamepad.findByIDAndDelete(gameId);
    if(!game) {
      return res.status(404).json({ error: 'Game not found'});
    }
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error'});
  }
});


app.get('/search', async (req,res)=>{
  const query = req.query.q;

  try {
    const results = await gameModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' }},
        { platform: { $regex: query, $options: 'i' }},
        { gerne: { $regex: query, $options: 'i' }},
      ],
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


app.listen(port, ()=>{
  console.log(`Server listening on port ${port}`);
});