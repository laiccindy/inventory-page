// Obtain arguments that are passed through the command line
const userArguments = process.argv.slice(2);

const artist = require('./models/artist.js');
const genre = require('./models/genre.js');
const song = require('./models/song.js');

const artists = [];
const genres = [];
const songs = [];

const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const mongoDB = userArguments[0];

main().catch((err)=>console.log(err));

async function main(){
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected");
  await createArtists();
  await createGenres();
  await createSongs();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close()
};

async function artistsCreate(index, name){
  const artistNew = new artist({ name: name });
  await artistNew.save();
  artists[index] = artistNew;
  console.log(`Added artist: ${artistNew}`);
};

async function genreCreate(index, name){
  const genreNew = new genre({ name:  name });
  await genreNew.save();
  genres[index] = genreNew;
  console.log(`Added genre: ${genreNew}`);
};

async function songCreate(index, name ,artist, genre){
  const songDetail ={
    name: name,
    artist: artist,
    genre: genre
  };
  const songNew = new song(songDetail);
  await songNew.save();
  songs[index] = song;
  console.log(`Added song ${song}`);
};

async function createGenres(){
  console.log("Adding gneres");
  await Promise.all([
    genreCreate(0, "Pop"),
    genreCreate(1, "Rock"),
    genreCreate(2, "Hip-Hop"),
    genreCreate(3, "R&B"),
    genreCreate(4, "Country"),
    genreCreate(5, "Electronic"),
    genreCreate(6, "Jazz"),
    genreCreate(7, "House"),
    genreCreate(8, "Indie"),
    genreCreate(9, "Rap")
  ]);
};

async function createArtists(){
  console.log("Adding artists");
  await Promise.all([
    artistsCreate(0, "Foo Fighters"),
    artistsCreate(1, "The Beatles"),
    artistsCreate(2, "Bon Jovi"),
    artistsCreate(3, "Frank Sinatra"),
    artistsCreate(4, "Selena"),
    artistsCreate(5, "Mac Miller"),
    artistsCreate(6, "Ice Spice"),
    artistsCreate(7, "Carlos Santana"),
    artistsCreate(8, "Avici"),
    artistsCreate(9, "Lana Del Rey")
  ]);
};

async function createSongs(){
  console.log("Adding songs");
  await Promise.all([
    songCreate(0, "Yellow Submarine", artists[1], genres[0]),
    songCreate(1, "Life", artists[2], genres[1]),
    songCreate(2, "LoveLost", artists[5], artists[9])
  ]);
};