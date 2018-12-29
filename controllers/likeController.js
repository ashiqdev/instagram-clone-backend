const mongoose = require('mongoose');

const Like = mongoose.model('Like');

exports.likePost = async (req, res) => {
  try {
    const liked = await Like.findOne({
      post: req.body.postId,
      like_by: req.user.id,
    });
    if (!liked) {
      /*eslint-disable */
      const newLike = await new Like({
        /* eslint-enable */
        post: req.body.postId,
        like_by: req.user.id,

      }).save();
      res.json({
        mssg: 'Successfully liked',
      });
    } else {
      res.status(400).json({
        alreadyLiked: 'User already liked this post',
      });
    }
  } catch (err) {
    res.json({
      postNotFound: 'post was not found',
    });
  }
};


// exports.unlike = async (req, res) => {
//   try {
//     const liked = await Like.findOne({
//       post: req.body.postId,
//       like_by: req.user.id,
//     });

//     if (liked) {
//       await Like.findOneAndRemove({ like_by: req.user.id });
//       res.json({
//         sucess: true,
//       });
//     } else {
//       res.json({
//         notLiked: 'You have not yet liked this post',
//       });
//     }
//   } catch (err) {
//     res.json({
//       postNotFound: 'post was not found',
//     });
//   }
// };


exports.unlike = async (req, res) => {
  try {
    const liked = await Like.findOne({
      post: req.body.postId,
      like_by: req.user.id,
    });

    if (liked) {
      await Like.findOneAndRemove({
        like_by: req.user.id,
      });

      res.json({ sucess: true });
    } else {
      res.json({
        notLiked: 'You have not yet liked this post',
      });
    }
  } catch (err) {
    res.json({
      postNotFound: 'post was not found',
    });
  }
};
