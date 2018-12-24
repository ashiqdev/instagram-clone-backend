const mongoose = require('mongoose');

const Scheme = mongoose.Schema;

const postSchema = new Scheme({
  type: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author',
  },

  created: {
    type: Date,
    default: Date.now,
  },

  desc: {
    type: String,
    trim: true,
  },

  image: {
    type: String
    // require: 'Please enter a photo',
  },

  filter: {
    type: String,
    trim: true
  },

  location: {
    type: String,
    trim: true
  },

  // type: String,

  group: {
    type: String,
    trim: true
  }
});
  // function autopopulate(next) {
  //   this.populate('author');
  //   next();
  // }

  // postSchema.pre('find', autopopulate);
  // postSchema.pre('findOne', autopopulate);



module.exports = mongoose.model('Post', postSchema);
