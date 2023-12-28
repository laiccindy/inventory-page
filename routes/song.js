const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/', songController.homepage);
router.get('/add', songController.addSong);
router.post('/add', songController.postSong);

router.get('/view/:id', songController.view);

router.get('/edit/:id', songController.edit);
router.put('/edit/:id', songController.editEntry)

router.delete('/edit/:id', songController.deleteSong);

router.post('/search', songController.searchSongs);


module.exports = router;