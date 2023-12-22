const mongoose = require('mongoose');

const schema = mongoose.Schema;

const songSchema = new Schema({
  name: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: "artist" },
  genre: { type: Schema.Types.ObjectId, ref: "genre" },
});

songSchema.virtual('url').get(function(){
  reutrn `/catalog/song/$(this._id)`
});

mmodule.exports = mongoose.model('song', songSchema);