const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
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
router.post('/delete-post', postController.deletePost);

module.exports = router;
