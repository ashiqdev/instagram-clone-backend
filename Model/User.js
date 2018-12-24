const mongoose = require('mongoose');

const Scheme = mongoose.Schema;

const userSchema = new Scheme({
  userName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },

  password: { type: String, required: true },
  avatar: { type: String },
  secretToken: { type: String },
  isActive: { type: Boolean },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  date: { type: Date, default: Date.now },

});

module.exports = mongoose.model('User', userSchema);
