const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const bookmarkController = require('../controllers/bookmarkcontroller');
const likeController = require('../controllers/likeController');
const { catchErrors } = require('../handlers/errorHandlers');

router.post('/users/register', userController.registerUser);
router.post('/users/verifyUser/:secretToken', userController.verifyUser);
router.post('/users/login', userController.loginUser);
router.post('/users/forget', userController.forget);
router.post('/users/resetpass/:token', userController.reset);
router.post(
  '/users/reset/:token',
  userController.confirmedPassword,
  userController.update,
);

router.get('/post-it', userController.isLoggedIn, postController.getPost);

router.post(
  '/post-it',
  userController.isLoggedIn,
  catchErrors(postController.createPost),
);

router.get(
  '/get-followings',
  userController.isLoggedIn,
  postController.getFollowings,
);

router.post(
  '/edit-post',
  userController.isLoggedIn,
  catchErrors(postController.editPost),
);

router.post(
  '/untag',
  userController.isLoggedIn,
  catchErrors(postController.untag),
);

// Delete post
router.post(
  '/delete-post',
  userController.isLoggedIn,
  postController.deletePost,
);

// Bjk
// router.post('/unlikes/:id', userController.isLoggedIn, postController.unLike);


// Likes (one approach)
router.post('/likes', userController.isLoggedIn, likeController.likePost);
router.post('/unlikes', userController.isLoggedIn, likeController.unlike);

// Likes (another approach)
// router.post('/likes/:id', userController.isLoggedIn, postController.likedOrNot);
// router.post('/remove-like/:id', userController.isLoggedIn, postController.removeLike);


// Bookmarks (one approach)
router.post('/bookmarks', userController.isLoggedIn, bookmarkController.bookmarkPost);
router.post('/remove-bookmark', userController.isLoggedIn, bookmarkController.removeBookMark);

module.exports = router;
