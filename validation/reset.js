const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateResetInput(data) {
  const errors = {};
  // first check if property is available in data i mean req.body
  let { email } = data;
  email = !isEmpty(email) ? email : '';


  // Check if any property is empty

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors),
  };
};
