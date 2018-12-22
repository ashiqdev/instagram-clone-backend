const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({

  // author: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User',
  //   required: 'You must supply an author',
  // },

  created: {
    type: Date,
    default: Date.now,
  },

  desc: {
    type: String,
    trim: true,
  },

  image: {
    type: String,
    // required: 'Please enter a photo',
  },

  filter: {
    type: String,
    trim: true,
  },

  location: {
    type: String,
    default: 'Point',
  },

  group: {
    type: String,
    trim: true,
  },

  // function autopopulate(next) {
  //   this.populate('author');
  //   next();
  // }

  // postSchema.pre('find', autopopulate);
  // postSchema.pre('findOne', autopopulate);

  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  tags: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },


});


module.exports = mongoose.model('Post', postSchema);
