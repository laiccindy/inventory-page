const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SongSchema = new Schema({
    name: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: "Artist" },
    genre: { type: Schema.Types.ObjectId, ref: "Genre" },
})

SongSchema.virtual('url').get(function () {
    return `/catalog/song/${this._id}`
})

module.exports = mongoose.model('Song', SongSchema)