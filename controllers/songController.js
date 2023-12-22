const asyncHandler = require('express-async-handler');
const song = require('../models/song.js');
const artist = require('../models/artist.js');
const genre = require('../models/genre.js');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req,res,next)=>{
  const [
    numSongs,
    numArtists,
    numGenres
  ] = await Promise.all([
    song.countDocuments({}).exec(),
    artist.countDocuments({}).exec(),
    genre.countDocuments({}).exec(),
  ])
  res.render('index', {
    title: "Music Inventory Home",
    song_cound: numSongs,
    artist_count: numArtists,
    genre_count: numGenres,
  })
  return
})


exports.song_detail = asyncHandler(async (req,res,next)=>{
  const songNew = await song.findById(req.params.id).populate('artist').populate('genre').exec()

  if (songNew===null){
    const err = new Error('Song not found')
    err.status = 404
    return next(err)
  }
  res.render('song_detail', {
    title: "Song Detail",
    song: songNew
  })
})


exports.songs_create_get = asyncHandler(async (req,res,next)=>{
  const [artists, genres] = await Promise.all([
    artist.find({}).populate('name').exec(),
    genre.find({}).populate('name').exec()
  ])
  res.render('song_form', {
    title: "Create Song",
    artists: artists,
    genres: genres
  })
})


exports.song_create_post = [
  body('name')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Artist is requried'),
  body('name')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Genre isrequired'),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);
    const songNew = new song({
      name: req.body.name,
      artist: req.body.artistNew,
      genre: req.body.genreNew
    })

    if (!errors.isEmpty()){
      const [allArtists, allGenres] = await Promise.all([
        artist.find().exec(),
        genre.find.exec(),
      ]);
      res.render('song_form', {
        title: "Create Song",
        artists: allArtists,
        genres: allGenres,
        song: songNew,
        errors: errors.array(),
      })
    } else{
      const songExist = await song.findOne({ name: req.body.name }).collation({ locale:"en", strength: 1 }).exec()
      if (songExists){
        res.redirect(songExists.url)
      } else {
        await songNew.save()
        res.redirect(songNew.url)
      }
    }
  })
]


exports.song_delete_post = [
  body('password')
  .equals(proess.env.password)
  .withMessage('wrong password'),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()){
      const songNew = await song.findById(req.params.id).exec()
      res.render("song_delete",{
        title: "Delete Song",
        song: songNew,
        errors: errors.array(),
      });
      return;
    } else{
      await song.findByIdAndDelete(req.body.song_id)
      res.redirect('/catalog/songs')
    }
  })
]


exports.song_update_get = asyncHandler(async (req,res,next)=>{
  const [songNew, allArtists, allGenres] = await Promise.all([
    song.findById(req.params.id).populate("artist").populate("genre").exec(),
    artist.find().exec(),
    genre.find().exec()
  ]);

  if (!songNew){
    const err = new Error("Song not found");
    err.status = 404;
    return next(err);
  }
  res.render("song_form", {
    title: "Update Song",
    artists: allArtists,
    genres: allGenres,
    song: songNew,
  })
})


exports.song_update_post = [
  body("name", "Name must not be empty")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("artistNew", "Artist must not be empty")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("genreNew", "Genre must not be empty")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);

    const songNew = new song({
      name: req.body.name,
      artist: req.body.artistNew,
      genre: req.body.genreNew,
      _id: req.params.id,
    });

    if (!errors.isEmpty()){
      const [allArtists, allGenres
      ] = await Promise.all([
        artist.find().exec(),
        genre.find().exec(),
      ]);
      res.render("song_form", {
        title: "Update Song",
        artists: allArtists,
        genres: allGenres,
        song: songNew,
        errors: errors.array(),
      });
      return;
    } else{
      const updatedSong = await song.findByIdAndUpdate(req.params.id, songNew, {});
      res.redirect(updatedSong.url);
    }
  })
]