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

// Post
router.get('/users/post-it', userController.isLoggedIn, postController.getPost);

router.post(
  '/users/post-it',
  userController.isLoggedIn,
  catchErrors(postController.createPost),
);

module.exports = router;
