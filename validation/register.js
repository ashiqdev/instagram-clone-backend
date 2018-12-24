const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let { userName } = data;
  let { firstName } = data;
  let { lastName } = data;
  let { email } = data;
  let { password } = data;

  userName = !isEmpty(userName) ? userName : '';
  firstName = !isEmpty(firstName) ? firstName : '';
  lastName = !isEmpty(lastName) ? lastName : '';
  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  // Check less than 2 char or not
  const errors = {};
  if (!Validator.isLength(userName, {
    min: 2,
    max: 30,
  })) {
    errors.userName = 'userName must be between 2 and 30 characters';
  }

  if (!Validator.isLength(firstName, {
    min: 2,
    max: 30,
  })) {
    errors.firstName = 'firstName must be between 2 and 30 characters';
  }

  if (!Validator.isLength(lastName, {
    min: 2,
    max: 30,
  })) {
    errors.lastName = 'lastName must be between 2 and 30 characters';
  }

  // Check if any property is empty
  if (Validator.isEmpty(userName)) {
    errors.name = 'userName field is required';
  }

  if (Validator.isEmpty(firstName)) {
    errors.firstName = 'firstName field is required';
  }

  if (Validator.isEmpty(lastName)) {
    errors.lastName = 'lastName field is required';
  }

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }

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
