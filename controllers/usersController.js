const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const User = require('../schema/userSchema');

// get all user
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};

// get user by id
exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

// create new user
exports.createUser = async (req, res) => {
  const { error, value } = User.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newUser = new User({
    id: uuidv4(),
    username: req.body.username,
    age: req.body.age,
    hobbies: req.body.hobbies || [],
  });

  await newUser.save();
  res.status(201).json(newUser);
};

// update user by id
exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { error, value } = User.validate(req.body);

  if (error) {
    return res.status(400).json({ error: "User id is invalid" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) {
      throw new Error('Error updating user');
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await User.deleteOne({ _id: userId });

  res.status(204).send();
};
