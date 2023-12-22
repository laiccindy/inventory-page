const mongoose = require('mongoose');

const schema = mongoose.schema;

const artistSchema = new schema({
  name: { type: String, required: true},
});

artistSchema.virtual('url').get(function(){
  return `/catalog/artist/$(this._id)`
});

module.exports = mongoose.model('artist', artistSchema);