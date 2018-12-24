const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateResetInput(data) {
  const errors = {};
  // first check if property is available in data i mean req.body
  let { password } = data;

  password = !isEmpty(password) ? password : '';


  // Check if any property is empty

  if (!Validator.isLength(password, {
    min: 6,
    max: 30,
  })) {
    errors.password = 'password must be at least 6 characters';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
