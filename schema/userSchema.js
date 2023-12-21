const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  username: { type: String, required: true, unique: false },
  age: { type: Number, required: true },
  hobbies: { type: [String], default: [] },
});

module.exports = mongoose.model('User', UserSchema);