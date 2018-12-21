const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const tagSchema = mongoose.Schema({
  
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "You must supply an author!",
  },

  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: "You must supply an post!",
  },

  tagged: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "You must supply an user!",
  }
});

module.exports = mongoose.model("Tag", tagSchema);
