const mongoose = require('mongoose');

const schema = mongoose.Schema;

const genreSchema  = new schema({
  name: { type: String, required: true },
});

genreSchema.virtual('url').get(function(){
  return  `/catalog/genre/this.$assertPopulated(this._id)`
});

module.exports = mongoose.model('genre', genreSchema);