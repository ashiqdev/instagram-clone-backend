const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookmarkSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },

  bookmark_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  bookmark_time: {
    type: Date,
    default: Date.now,
  },


});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
