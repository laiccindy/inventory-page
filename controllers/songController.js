const asyncHandler = require('express-async-handler')
const Song = require('../models/song.js')
const Artist = require('../models/artist.js')
const Genre = require('../models/genre.js')
const { body, validationResult } = require('express-validator')

exports.index = asyncHandler(async (req, res, next) => {
    const [
        numSongs,
        numArtists,
        numGenres
    ] = await Promise.all([
        Song.countDocuments({}).exec(),
        Artist.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
    ])

    res.render('index', {
        title: "Music Inventory Home",
        song_count: numSongs,
        artist_count: numArtists,
        genre_count: numGenres,
    })
    return
})

exports.song_list = asyncHandler(async (req, res, next) => {
    const allSongs = await Song.find({})
        .sort({ name: 1 })
        .populate('artist')
        .populate('genre')
        .exec()
    res.render('songs', {
        title: "Song List",
        song_list: allSongs
    })
})

exports.song_detail = asyncHandler(async (req, res, next) => {
    const song = await Song.findById(req.params.id).populate('artist').populate('genre').exec()

    if (song === null) {
        const err = new Error('Song not found')
        err.status = 404
        return next(err)
    }
    res.render('song_detail', {
        title: "Song Detail",
        song: song
    })
})

exports.song_create_get = asyncHandler(async (req, res, next) => {
    const [artists, genres] = await Promise.all([
        Artist.find({}).populate('name').exec(),
        Genre.find({}).populate('name').exec()
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
        .withMessage('Song name is required'),
    body("artist")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Artist is required'),
    body('genre')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Genre is required'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const song = new Song({
            name: req.body.name,
            artist: req.body.artist,
            genre: req.body.genre
        })

        if (!errors.isEmpty()) {
            const [allArtists, allGenres] = await Promise.all([
                Artist.find().exec(),
                Genre.find().exec(),
            ]);

            res.render('song_form', {
                title: "Create Song",
                artists: allArtists,
                genres: allGenres,
                song: song,
                errors: errors.array(),
            })
        } else {
            const songExists = await Song.findOne({ name: req.body.name }).collation({ locale: "en", strength: 1 }).exec()
            if (songExists) {
                res.redirect(songExists.url)
            } else {
                await song.save()
                res.redirect(song.url)
            }
        }
    })
]

exports.song_delete_get = asyncHandler(async (req, res, next) => {
    const song = await Song.findById(req.params.id).exec()
    if (song === null) {
        res.redirect('/catalog/songs')
    } else {
        res.render('song_delete', {
            title: "Delete Song",
            song: song
        })
    }
})

exports.song_delete_post = [
    body('password')
        .equals(process.env.password)
        .withMessage('wrong password!'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            const song = await Song.findById(req.params.id).exec()
            res.render("song_delete", {
                title: "Delete Song",
                song: song,
                errors: errors.array(),
            });
            return;
        } else {
            await Song.findByIdAndDelete(req.body.song_id)
            res.redirect('/catalog/songs')
        }
    })
]


exports.song_update_get = asyncHandler(async (req, res, next) => {
    const [song, allArtists, allGenres] = await Promise.all([
        Song.findById(req.params.id).populate("artist").populate("genre").exec(),
        Artist.find().exec(),
        Genre.find().exec(),
    ]);

    if (!song) {
        const err = new Error("Song not found");
        err.status = 404;
        return next(err);
    }

    res.render("song_form", {
        title: "Update Book",
        artists: allArtists,
        genres: allGenres,
        song: song,
    })
})

exports.song_update_post = [
    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("artist", "Artist must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("genre", "Genre must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const song = new Song({
            name: req.body.name,
            artist: req.body.artist,
            genre: req.body.genre,
            _id: req.params.id, // This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            const [allArtist, allGenres] = await Promise.all([
                Artist.find().exec(),
                Genre.find().exec(),
            ]);

            res.render("song_form", {
                title: "Update Song",
                artists: allArtist,
                genres: allGenres,
                song: song,
                errors: errors.array(),
            });
            return;
        } else {
            const updatedSong = await Song.findByIdAndUpdate(req.params.id, song, {});
            res.redirect(updatedSong.url);
        }
    })
]