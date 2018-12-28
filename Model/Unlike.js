const mongoose = require('mongoose');

const { Schema } = mongoose;

const unlikeSchema = new Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
  },
  unlike_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  unlike_time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Unlike', unlikeSchema);
