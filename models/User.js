const mongoose = require('mongoose');
const validator = require('validator');

console.log("entered models");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});
console.log("exiting  models");

module.exports = mongoose.model('User', userSchema);
