const mongoose = require('mongoose');

const Scheme = mongoose.Schema;

const tagSchema = new Scheme({  
  type: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author!',
  },

  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: 'You must supply an post!',
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an user!',
  },
});

module.exports = mongoose.model('Tag', tagSchema);
