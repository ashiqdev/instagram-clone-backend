const mongoose = require('mongoose');


const Bookmark = mongoose.model('Bookmark');


exports.bookmarkPost = async (req, res) => {
  try {
    const bookmarked = await Bookmark.findOne({
      post: req.body.postId,
      bookmark_by: req.user.id,
    });
    if (!bookmarked) {
      /*eslint-disable */
      const newbmark = await new Bookmark({
         /* eslint-enable */
        post: req.body.postId,
        bookmark_by: req.user.id,
      }).save();
      res.json({ mssg: 'Successfully bookmarked' });
    } else {
      res.status(400).json({ alreadyBookmarked: 'User already bookmarked this post' });
    }
  } catch (err) {
    res.json({ postNotFound: 'post was not found' });
  }
};

exports.removeBookMark = async (req, res) => {
  try {
    const bookmarked = await Bookmark.findOne({
      post: req.body.postId,
      bookmark_by: req.user.id,
    });

    if (bookmarked) {
      await Bookmark.findOneAndRemove({
        bookmark_by: req.user.id,
      });

      res.json({ sucess: true });
    } else {
      res.json({
        notBookmarked: 'You have not yet bookmarked this post',
      });
    }
  } catch (err) {
    res.json({
      postNotFound: 'post was not found',
    });
  }
};
