const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  const errors = {};
  // first check if property is available in data i mean req.body
  let {
    email,
  } = data;
  let {
    password,
  } = data;

  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';


  // Check if any property is empty

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'password field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors),
  };
};
