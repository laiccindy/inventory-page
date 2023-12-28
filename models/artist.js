const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ArtistSchema = new Schema({
    name: { type: String, required: true },
})

ArtistSchema.virtual('url').get(function () {
    return `/catalog/artist/${this._id}`
})

module.exports = mongoose.model('Artist', ArtistSchema)