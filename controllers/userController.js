const mongoose = require('mongoose');

const User = mongoose.model('User');
const gravatar = require('gravatar');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const debug = require('debug')('myapp');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mailer = require('../misc/mailer');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateResetInput = require('../validation/reset');
const validatePasswordInput = require('../validation/resetPassword');


exports.registerUser = async (req, res) => {
  const {
    errors,
    isValid,
  } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    res.status(400).json(errors);
    return;
  }

  User.findOne({
    $or: [{ email: req.body.email }, { userName: req.body.userName }],
  }).then((user) => {
    if (user) {
      errors.email = 'Email already exists or userName is already taken';
      res.status(400).json(errors);
      return;
    }
    const avatar = gravatar.url(req.body.email, {
      s: '200', // Size
      r: 'pg', // Rating
      d: 'mm', // Default
    });
    const secretToken = crypto.randomBytes(10).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour
    const isActive = false;

    //  Create a User
    const newUser = new User({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      avatar,
      password: req.body.password,
      secretToken,
      resetTokenExpires,
      isActive,
    });


    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (error, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((newuser) => {
            const filteredUser = {
              userName: newuser.userName,
              firstName: newuser.firstName,
              lastName: newuser.lastName,
              email: newuser.email,
              avatar: newuser.avatar,
            };
            const verifyURL = `http://${req.headers.host}/api/users/verifyUser/${newuser.secretToken}`;
            const html = `Hello there,
                <br>
                Thanks for registering in <b>To To Company</b>
                <br>
                To activate your account please click the following link 
                <a href = ${verifyURL}><h1>Verify</h1></a>
                <br>
                Have a nice Day!`;
            mailer.sendEmail('toto@company.com', req.body.email, 'Please verify your email', html).then(() => {});
            res.json(filteredUser);

            //  please activate your account, we sent an activation email to john@gmail.com
          })
          .catch(errorss => debug(errorss));
      });
    });
  });
};

exports.verifyUser = async (req, res) => {
  const errors = {};
  const {
    secretToken,
  } = req.params;
  const user = await User.findOne({
    secretToken,
    resetTokenExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    errors.user = 'Invalid Token';
    res.status(400).json(errors);
    return;
  }

  user.isActive = true;
  user.secretToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  // REACT => your account is now activated, you can login now
  // redirect to the login page
  res.json({ success: true });
};

exports.loginUser = async (req, res) => {
  const {
    errors,
    isValid,
  } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    res.status(400).json(errors);
    return;
  }
  // const email = req.body.email;
  // const password = req.body.password;

  // Find user by email
  const user = await User.findOne({
    userName: req.body.userName,
  });
  // Check for user
  if (!user) {
    errors.email = 'user not found';
    res.status(400).json(errors);
    return;
  }
  // Check password
  // Compare password from req.body with hashed
  bcrypt.compare(req.body.password, user.password)
    .then((isMatch) => {
      if (isMatch) {
        // User matched
        // check if user has been verified
        if (!user.isActive) {
          errors.email = 'You need to verify your email first!';
          res.status(400).json(errors);
          return;
        }
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        }; // Create jwt payload

        // Sign token
        const secret = process.env.SECRET;
        jwt.sign(payload,
          secret, {
            expiresIn: 3600,
          }, (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`,
              userName: user.userName,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              avatar: user.avatar,


            });
          });
      } else {
        errors.password = 'Password Incorrect';
        res.status(400).json(errors);
      }
    });
};

exports.forget = async (req, res) => {
  const {
    errors,
    isValid,
  } = validateResetInput(req.body);
  // Check validation
  if (!isValid) {
    res.status(400).json(errors);
    return;
  }
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    errors.noUser = 'No Account with that email exists';
    res.status(400).json(errors);
    return;
  }
  user.resetToken = crypto.randomBytes(10).toString('hex');
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  const resetURL = `http://${req.headers.host}/api/users/resetpass/${user.resetToken}`;
  // you have been emailed a password reset link
  const html = `<b>Password Reset</b>,
                 <br>
                 <p>Someone requested that your password be reset. 
                 <br>
                 If this wasn't you, you can safely ignore this email and your password will remain the same.
                 <br>
                <a href = ${resetURL}><h1>RESET PASSWORD</h1></a>
                 Have a nice Day! </p>`;

  mailer.sendEmail('toto@company.com', req.body.email, 'Password Reset', html).then(() => {});
  // REACT => You have been emailed a password reset link

  res.json({ success: true });
  // redirect to login page
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    // REACT => Password reset token is invalid or expired
    res.status(404).send('Password reset token is invalid or expired');
    return;
    // redirect them to login page
  }

  // If there is a user, go to reset password form (REACT)
  res.send({ success: true });
};

exports.confirmedPassword = async (req, res, next) => {
  const {
    errors,
    isValid,
  } = validatePasswordInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.body.password === req.body.password2) {
    next();
    return true;
  }
  errors.match = 'Passwords do not match';
  return res.status(400).json('Passwords do not match');
  // redirect them to same page (REACT)
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    // REACT => Password reset token is invalid or expired
    res.status(404).send('Password reset token is invalid or expired');
    return;
    // redirect them to login page
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (error, hash) => {
      if (error) throw err;
      req.body.password = hash;
      user.password = req.body.password;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      user.save()
        .then(() => {
          // nice your password has been reset,
          // redirect to login page
          res.json({ success: true });
        });
    });
  });
};

exports.isLoggedIn = passport.authenticate('jwt', {
  session: false,
});
