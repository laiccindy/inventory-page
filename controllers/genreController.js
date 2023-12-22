const genre = require('../models/genre.js');
const song = require('../models/song.js');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.genre_list = asyncHandler(async (req,res,next)=>{
  const allGenres = await genre.find().sort({ name: 1 }).exec()
  res.render('genres', {
    title: "Genre List",
    gere_list: allGenres
  });
});


exports.genre_detail = asyncHandler(async (req,res,next)=>{
  const [genreNew, allGenreSongs] = await Promise.all([
    genre.findById(req.params.id).exec(),
    song.find({ genre: req.params.id }).populate('name').exec()
  ])
  if (genreNew===null) {
    const err = new Error("Genre not found")
    err.status = 404
    return next(err)
  }
  res.render('genre_detail',{
    title: "Genre Detail",
    genre: genreNew,
    genre_songs: allGenreSongs
  })
})


exports.genre_create_post = [
  body('genre_name')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Genre is required"),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req)
    const genreNew = new genre({ name: req.body.genre_name })

    if (!errors.isEmpty()){
      res.render('genre_form', {
        title: "Create Genre",
        genre: genreNew,
        errors: errors.array()
      })
    } else{
      const genreExists = await genre.findOne({ name: req.body.genre_name }).collation({ locale: "en", strength: 1 }).exec();
      if (genreExists) {
        res.redirect(genreExists.url)
      }else{
        await genre.save()
        res.redirect(genreNew.url)
      }
    }
  })
]


exports.genre_delete_get = asyncHandler(async (req,res,next)=>{
  const [genreNew, allSongsInGenre] = await Promise.all([
    genre.findById(req.params.id).exec(),
    song.find({ genre: req.params.id }).populate('name').exec()
  ])
  if (genreNew===null){
    res.redirect('/catalog/artists')
  } else{
    res.render('genre_delete', {
      title: "Delete Genre",
      genre: genreNew,
      genre_songs: allSongsInGenre
    })
  }
})


exports.genre_delete_post = [
  body('password')
  .equals(process.env.password)
  .withMessage('wrong password'),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);
    const [genreNew, genreSongs] = await Promise.all([
      genre.findById(req.params.id).exec(),
      song.find({ genre: req.params.id }).populate('name').exec()
    ])
    const render = (err)=> res.render('genre_delete', {
      title: "Delete Genre",
      genre: genreNew,
      genre_songs: genreSongs,
      errors: err ? errors.array() : ''
    })
    if (!errors.isEmpty()) {
      render(errors)
      return
    } else{
      await song.findByIdAndDelete(req.body.song_id)
      res.redirect('/catalog/songs')
    }
  })
]


exports.genre_update_get = asyncHandler(async (req,res,next)=>{
  const genreNew = await genre.findById(req.params.id).exec()

  if(!genreNew){
    const err = new Error("Song not found");
    err.status = 404;
    return next(err);
  }
  res.render("genre_form",{
    title: "Update Genre",
    genre: genreNew,
  })
})


exports.genre_update_post = [
  body("genre_name", "Name must not be empty")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);
    const genreNew = new genre({
      name: req.body.genre_name,
      _id: req.params.id,
    });
    if(!errors.isEmpty()){
      res.render("genre_form", {
        title: "Update Genre",
        genres: genreNew,
        errors: errors.array(),
      });
      return
    } else{
      const updatedGenre = await genre.findByIdAndUpdate(req.params.id, genreNew, {});
      res.redirect(updatedGenre.url);
    }
  })
]