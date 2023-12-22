const express = require('express')
const router = express.Router()

const artist_controller = require('../controllers/artistController')
const genre_controller = require('../controllers/genreController')
const song_controller = require('../controllers/songController')

// SONGS ROUTES
router.get('/', song_controller.index)

router.get('/song/create', song_controller.song_create_get)
router.post('/song/create', song_controller.song_create_post)

router.get('/song/:id/delete', song_controller.song_delete_get)
router.post('/song/:id/delete', song_controller.song_delete_post)

router.get('/song/:id/update', song_controller.song_update_get)
router.post('/song/:id/update', song_controller.song_update_post)

router.get('/song/:id', song_controller.song_detail)
router.get('/songs', song_controller.song_list)

// // ARTISTS ROUTES
router.get('/artist/create', artist_controller.artist_create_get)
router.post('/artist/create', artist_controller.artist_create_post)

router.get('/artist/:id/delete', artist_controller.artist_delete_get)
router.post('/artist/:id/delete', artist_controller.artist_delete_post)

router.get('/artist/:id/update', artist_controller.artist_update_get)
router.post('/artist/:id/update', artist_controller.artist_update_post)

router.get('/artist/:id', artist_controller.artist_detail)
router.get('/artists', artist_controller.artist_list)

// // GENRE ROUTES

router.get('/genre/create', genre_controller.genre_create_get)
router.post('/genre/create', genre_controller.genre_create_post)

router.get('/genre/:id/delete', genre_controller.genre_delete_get)
router.post('/genre/:id/delete', genre_controller.genre_delete_post)

router.get('/genre/:id/update', genre_controller.genre_update_get)
router.post('/genre/:id/update', genre_controller.genre_update_post)

router.get('/genre/:id', genre_controller.genre_detail)
router.get('/genres', genre_controller.genre_list)

module.exports = router;