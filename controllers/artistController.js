const Artist = require('../models/artist.js')
const Song = require('../models/song.js')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

exports.artist_list = asyncHandler(async (req, res, next) => {
    const allArtists = await Artist.find().sort({ name: 1 }).exec()
    res.render('artists', {
        title: "Artists List",
        artist_list: allArtists
    })
})

exports.artist_detail = asyncHandler(async (req, res, next) => {
    const [artist, allSongsByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Song.find({ artist: req.params.id }).populate('name genre').exec()
    ])
    if (artist === null) {
        const err = new Error('Artist not found')
        err.status = 404
        return next(err)
    }

    res.render('artist_detail', {
        title: "Artist detail",
        artist: artist,
        artist_songs: allSongsByArtist
    })
})

exports.artist_create_get = asyncHandler(async (req, res, next) => {
    res.render('artist_form', {
        title: "Create Artist"
    })
})

exports.artist_create_post = [
    body("artist_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name is required"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const artist = new Artist({ name: req.body.artist_name })

        if (!errors.isEmpty()) {
            res.render("artist_form", {
                title: "Create Author",
                artist: artist,
                errors: errors.array()
            })
        } else {
            const artistExists = await Artist.findOne({ name: req.body.artist_name }).collation({ locale: "en", strength: 1 }).exec()
            if (artistExists) {
                res.redirect(artistExists.url)
            } else {
                await artist.save()
                res.redirect(artist.url)
            }
        }
    })
]

exports.artist_delete_get = asyncHandler(async (req, res, next) => {
    const [artist, allSongsByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Song.find({ artist: req.params.id }).populate('name').exec()
    ])

    if (artist === null) {
        res.redirect('/catalog/artists')
    } else {
        res.render('artist_delete', {
            title: "Delete Artist",
            artist: artist,
            artist_songs: allSongsByArtist
        })
    }
})

exports.artist_delete_post = [
    body('password')
        .equals(process.env.password)
        .withMessage('wrong password!'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const [artist, artistSongs] = await Promise.all([
            Artist.findById(req.params.id).exec(),
            Song.find({ artist: req.params.id }).populate('name').exec()
        ])

        const render = (err) => res.render('artist_delete', {
            title: "Delete Artist",
            artist: artist,
            artist_songs: artistSongs,
            errors: err ? errors.array() : ''
        })

        if (!errors.isEmpty()) {
            render(errors)
            return;
        } else if (artistSongs > 0) {
            render(null)
            return
        } else {
            await Artist.findByIdAndDelete(req.body.artist_id)
            res.redirect('/catalog/artists')
        }
    })
]

exports.artist_update_get = asyncHandler(async (req, res, next) => {
    const artist = await Artist.findById(req.params.id).exec()

    if (!artist) {
        const err = new Error("Song not found");
        err.status = 404;
        return next(err);
    }

    res.render("artist_form", {
        title: "Update Artist",
        artist: artist,
    })
})

exports.artist_update_post = [
    body("artist_name", "Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const artist = new Artist({
            name: req.body.artist_name,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render("artist_form", {
                title: "Update Artist",
                artist: artist,
                errors: errors.array(),
            });
            return;
        } else {
            const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, artist, {});
            res.redirect(updatedArtist.url);
        }
    })
]