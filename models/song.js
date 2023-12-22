const mongoose = require('mongoose');

const schema = mongoose.Schema;

const songSchema = new schema({
  name: { type: String, required: true },
  artist: { type: schema.Types.ObjectId, ref: "artist" },
  genre: { type: schema.Types.ObjectId, ref: "genre" },
});

songSchema.virtual('url').get(function(){
  reutrn `/catalog/song/$(this._id)`
});

module.exports = mongoose.model('song', songSchema);