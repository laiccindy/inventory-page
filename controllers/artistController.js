const artist = require('../models/artist.js');
const song = require('../models/song.js');
const asyncHandler = require('express-asyn-handler');
const { body, validationResult } = require('express-validator');

exports.artist_list = asyncHandler(async (req, res, next)=>{
  const allArtists = await artist.find().sort({ name: 1}).exec();
  res.render('artists',{
    title: "Artists List",
    artst_list: allArtists
  });
});

exports.artist_detail =  asyncHandler(async (req, res, next)=>{
  const [artistNew, allSongsByArtist] = await Promise.all([
    artist.findById(req.params.id).exec(),
    song.find({ artist: req.params.id }).populate('name genre').exec()
  ])
  if(artistNew===null){
    const err = new Error('Artist not found');
    err.status  = 404
    return next(err)
  }
  res.render('artist_detail',{
    ttle: "Artist detail",
    artist: artist,
    artist_songs: allSongsByArtist
  });
});


exports.artist_create_post = [
  body("artist_name")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Name is requried"),

  asyncHandler(async (req, res, next)=>{
    const errors = validationResult(req);
    const artistNew = new artist({ name: req.body.artist_name })

    if(!errors.isEmpty()){
      res.nder("artist_form",{
        title: "Create Author",
        artist: artistNew,
        errors: error.array()
      })
    } else{
      const artistExists = await artist.finOne({ name: req.body.artist_name }).collation({ locale: "en", strength: 1 }).exec()
      if(artistExists){
        res.redirect(artistExists.url)
      } else {
        await artistNew.save()
        res.redirect(artistNew.url)
      }
    }
  })
]


exports.artist_delete_get = asyncHandler(async (req,res,next)=>{
  const [artistNew, allSongsByArtist] = await Promise.all([
    artist.findById(req.params.id).exec(),
    song.find({ artist: req.params.id}).populate('name').exec()
  ])

  if (artistNew===null){
    res.redirect('/catalog/artists')
  } else{
    res.render('artist_delete', {
      title: "Delete Artist",
      artist: artistNew,
      artist_songs: allSongsByArtist
    });
  };
});


exports.artist_delete_post = [
  body('password')
    .equals(process.env.password)
    .withMessage('wrong password!'),
  
  asyncHandler(async (req, res, next)=>{
    const errors = validationResult(req);
    const [artistNew, artistSongs] = await Promise.all([
      atist.findById(req.params.id).exec(),
      song.find({ artst: req.params.id }).populate('name').exec()
    ]);
    const render = (err)=> res.render('artist_delete', {
      title: "Delete Artist",
      artist: artistNew,
      artist_songs: artistSongs,
      errors: err ? errors.array() : ''
    });
    if (!errors.isEmpty()){
      render(errors)
      return;
    } else if (artistSongs>0) {
      render(null)
      return
    } else {
      await artist.findByIdAndDelete(req.body.artist_id)
      res.redirect('/catalog/artists')
    }
  })
]


exports.artist_update_get = asyncHandler(async (req,res,next)=>{
  const artistNew = await artist.findById(req.params.id).exec()

  if (!artistNew){
    const err = new Error("Song not found");
    err.status  = 404;
    return next(err);
  }
  res.render("artist_form", {
    title: "Update Artist",
    artist: artistNew,
  });
});


exports.artist_update_post = [
  body("artist_name", "Name must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),

  asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      const artistNew = new artist({
          name: req.body.artist_name,
          _id: req.params.id,
      });

      if (!errors.isEmpty()) {
          res.render("artist_form", {
              title: "Update Artist",
              artist: artistNew,
              errors: errors.array(),
          });
          return;
      } else {
          const updatedArtist = await artist.findByIdAndUpdate(req.params.id, artistNew, {});
          res.redirect(updatedArtist.url);
      }
  })
]