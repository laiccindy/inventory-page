const Genre = require('../models/genre.js')
const Song = require('../models/song.js')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find().sort({ name: 1 }).exec()
    res.render('genres', {
        title: "Genre List",
        genre_list: allGenres
    })
})

exports.genre_detail = asyncHandler(async (req, res, next) => {
    const [genre, allGenreSongs] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Song.find({ genre: req.params.id }).populate('name').exec()
    ])
    if (genre === null) {
        const err = new Error("Genre not found")
        err.status = 404
        return next(err)
    }

    res.render('genre_detail', {
        title: "Genre Detail",
        genre: genre,
        genre_songs: allGenreSongs
    })
})

exports.genre_create_get = asyncHandler(async (req, res, next) => {
    res.render('genre_form', {
        title: 'Create Genre'
    })
})

exports.genre_create_post = [
    body('genre_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Genre is required"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const genre = new Genre({ name: req.body.genre_name })

        if (!errors.isEmpty()) {
            res.render('genre_form', {
                title: "Create Genre",
                genre: genre,
                errors: errors.array()
            })
        } else {
            const genreExists = await Genre.findOne({ name: req.body.genre_name }).collation({ locale: "en", strength: 1 }).exec();
            if (genreExists) {
                res.redirect(genreExists.url)
            } else {
                await genre.save()
                res.redirect(genre.url)
            }
        }
    })
]

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    const [genre, allSongsInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Song.find({ genre: req.params.id }).populate('name').exec()
    ])

    if (genre === null) {
        res.redirect('/catalog/artists')
    } else {
        res.render('genre_delete', {
            title: "Delete Genre",
            genre: genre,
            genre_songs: allSongsInGenre
        })
    }
})

exports.genre_delete_post = [
    body('password')
        .equals(process.env.password)
        .withMessage('wrong password!'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const [genre, genreSongs] = await Promise.all([
            Genre.findById(req.params.id).exec(),
            Song.find({ genre: req.params.id }).populate('name').exec()
        ])
        const render = (err) => res.render('genre_delete', {
            title: "Delete Genre",
            genre: genre,
            genre_songs: genreSongs,
            errors: err ? errors.array() : ''
        })

        if (!errors.isEmpty()) {
            render(errors)
            return;
        } else if (genreSongs > 0) {
            render(null)
            return
        } else {
            await Song.findByIdAndDelete(req.body.song_id)
            res.redirect('/catalog/songs')
        }
    })

]

exports.genre_update_get = asyncHandler(async (req, res, next) => {
    const genre = await Genre.findById(req.params.id).exec()

    if (!genre) {
        const err = new Error("Song not found");
        err.status = 404;
        return next(err);
    }

    res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
    })
})

exports.genre_update_post = [
    body("genre_name", "Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre({
            name: req.body.genre_name,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Update Genre",
                genres: genre,
                errors: errors.array(),
            });
            return;
        } else {
            const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
            res.redirect(updatedGenre.url);
        }
    })
]