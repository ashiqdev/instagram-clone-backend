const mongoose = require('mongoose');

const Post = mongoose.model('Post');
// const User = mongoose.model('User');
// const Tag = mongoose.model('Tag');

const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({
        message: 'That filetype isn\'t allowed!',
      }, false);
    }
  },
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

exports.createPost = async (req, res) => {
  req.body.type = req.user.id;
  req.body.tags = req.user.id;
  await new Post(req.body).save();
  const errors = {};
  const post = await Post.findOne({
    tags: req.user.id,
  }).populate('tags', ['userName']);
  if (!post) {
    errors.noPost = 'There is no post for this user';
    res.status(400).json(errors);
    return;
  }

  res.json(post);

  // const {
  //   tags,
  // } = req.body.tags;

  // const tagPeople = tags.map(tag => ({
  //   author: req.user._id,
  //   post: post._id,
  //   tagged: tag.tagged,
  // }));

  // await Tag.insertMany(tagPeople);

  // Response Json
};

exports.getPost = async (req, res) => {
  const errors = {};
  const post = await Post.findOne({
    tags: req.user.id,
  }).populate('type', ['userName']);
  if (!post) {
    errors.noPost = 'There is no post for this user';
    res.status(400).json(errors);
    return;
  }
  res.json(post);
};

// Message for Ashik
// 1) First do this 3 route of code than we disscuss about Tags
// 2) do not change the structure of my part of code if there is no error

// Get Post
// Edit Post
// Delete Post
