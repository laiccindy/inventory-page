#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Artist = require('./models/artist.js')
const Genre = require('./models/genre.js')
const Song = require('./models/song.js')

const artists = []
const genres = []
const songs = []

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0]

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createArtists();
  await createGenres();
  await createSongs();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}


async function artistsCreate(index, name) {
  const artist = new Artist({ name: name })
  await artist.save()
  artists[index] = artist
  console.log(`Added artist: ${artist}`)
}

async function genreCreate(index, name) {
  const genre = new Genre({ name: name })
  await genre.save()
  genres[index] = genre
  console.log(`Added genre: ${genre}`)
}

async function songCreate(index, name, artist, genre) {
  const songDetail = {
      name: name,
      artist: artist,
      genre: genre
  };
  const song = new Song(songDetail)
  await song.save()
  songs[index] = song
  console.log(`Added song ${song}`)
}

async function createGenres() {
  console.log("Adding genres")
  await Promise.all([
      genreCreate(0, "Pop"),
      genreCreate(1, "Rock"),
      genreCreate(2, "Hip-hop"),
      genreCreate(3, "R&B"),
      genreCreate(4, "Country"),
      genreCreate(5, "Electronic"),
      genreCreate(6, "Jazz"),
      genreCreate(7, "Dance"),
      genreCreate(8, "Indie"),
      genreCreate(9, "Rap")
  ])
}

async function createArtists() {
  console.log("Adding artists")
  await Promise.all([
      artistsCreate(0, "The Beattles"),
      artistsCreate(1, "Michael Jackson"),
      artistsCreate(2, "Frank Sinatra"),
      artistsCreate(3, "Ice Spice"),
      artistsCreate(4, "Foo  Fighters"),
      artistsCreate(5, "Carlos Santana"),
      artistsCreate(6, "Selena"),
      artistsCreate(7, "Eminem"),
      artistsCreate(8, "Mac Miller"),
  ])
}

async function createSongs() {
  console.log('Adding Songs')
  await Promise.all([
      songCreate(0, "Como la Flor", artists[6], genres[0]),
      songCreate(0, "Yellow Submarine", artists[0], genres[0]),
      songCreate(0, "Life", artists[2], genres[2]),
      songCreate(0, "Karma", artists[3], genres[9]),
      songCreate(0, "Everlong", artists[8], genres[9]),
  ])
}