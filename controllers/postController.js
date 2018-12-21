const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const Tag = mongoose.model("Tag");

const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  }
};

exports.upload = multer(multerOptions).single("photo");

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split("/")[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

exports.createPost = async (req, res) => {

  req.body.author = req.user._id;
  const post = await new Post(req.body).save();

  const { tags } = req.body.tags;

  let tagPeople = tags.map(tag => {
      return {
        author: req.user._id,
        post: post._id,
        tagged: tag.tagged,
      };    
  });

  await Tag.insertMany(tagPeople);

  // Response Json
  
};

// Message for Ashik
// 1) First do this 3 route of code than we disscuss about Tags
// 2) do not change the structure of my part of code if there is no error     
 
// Get Post
// Edit Post
// Delete Post
