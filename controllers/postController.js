const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Tag = mongoose.model('Tag');

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

// Create
exports.createPost = async (req, res) => {
  req.body.type = req.user.id;
  const post = await new Post(req.body).save();

  const { tags } = req.body;

  const tagPeople = tags.map(tag => ({ type: req.body.type, post: post.id, user: tag.user }));

  await Tag.insertMany(tagPeople);

  // Response
  const postResponse = await Post.findOne({ _id: post.id }).populate('type', ['firstName', 'lastName']);

  if (!postResponse) {
    res.status(400).json({ message: 'There is no post for this user' });
    return;
  }

  res.json({
    firstname: postResponse.type.firstName,
    lastname: postResponse.type.lastName,
    mesg: 'Posted!!',
    post_id: postResponse.id,
    success: true,
  });
};


// Get
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


// Edit Post
// Delete Post
