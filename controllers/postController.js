const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Tag = mongoose.model('Tag');
const Unlike = mongoose.model('Unlike');

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
      next(
        {
          message: "That filetype isn't allowed!",
        },
        false,
      );
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

  const tagPeople = tags.map(tag => ({
    type: req.body.type,
    post: post.id,
    user: tag.user,
  }));

  await Tag.insertMany(tagPeople);

  // Response
  const postResponse = await Post.findOne({ _id: post.id }).populate('type', [
    'firstName',
    'lastName',
  ]);

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

exports.getFollowings = async (req, res) => {
  const response = [
    { follow_to: 24, follow_to_username: 'takkar' },
    { follow_to: 11, follow_to_username: 'nobita' },
    { follow_to: 32, follow_to_username: 'iamrakib' },
    { follow_to: 30, follow_to_username: 'doraemon' },
    { follow_to: 28, follow_to_username: 'selena' },
    { follow_to: 16, follow_to_username: 'zayn' },
  ];

  res.status(200).send(response);
};

// Edit Post
exports.editPost = async (req, res) => {
  const { post_id, description } = req.body;
  await Post.update({ _id: post_id }, { $set: { desc: description } });

  res.json({
    success: true,
    mssg: 'Post updated!!',
  });
};

// UnTag
exports.untag = async (req, res) => {
  const { post, user } = req.body;
  await Tag.findOneAndRemove({ post, user });
  res.json({ success: true });
};

// delete
exports.deletePost = async (req, res) => {
  const post = await Post.findOneAndRemove({ _id: req.body.id });
  if (post) {
    res.status(200).json({
      success: true,
      mssg: 'Post deleted!!',
    });
  } else {
    res.status(400).json('Post Not found');
  }
};
// <<<<<<< HEAD
// =======

exports.likedOrNot = async (req, res) => {
  await Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (
        post.likes.filter(like => like.user.toString() === req.user.id).length
        > 0
      ) {
        res.status(400).json({ alreadyLiked: 'User already liked this post' });
        return;
      }
      // Add user id to the likes array
      post.likes.unshift({ user: req.user.id });

      post.save().then(mypost => res.json({
          post_id: req.params.id,
          liked_by: mypost.likes,
        }),);
    })
    .catch(() => res.status(404).json({ postNotFound: 'no post found' }));
};
// >>>>>>> ba09872689c2370b1a1d5ea77a4889aa5ed2f022

// Unlike Route
exports.unLike = async (req, res) => {
  
  const unLike = await Unlike.find({
    post: req.params.id,
    unlike_by: req.user.id,
  });
  
  if (unLike.length === 0) {
    const unlike = new Unlike({
      post: req.params.id,
      unlike_by: req.user.id,
    });

    unlike.save();
    res.json({ mesg: 'saved unlike' });
    return;
  }

  res.status(400).json({ mesg: 'already unliked this post' });
};
