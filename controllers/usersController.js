const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
// const Joi = require('joi');
const userSchema = require('../userSchema');
const DATA_FILE = 'data.json';

// Load data from the JSON file on server start
let users = loadData();

function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading data:', error.message);
    return [];
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving data:', error.message);
  }
}



exports.getAllUsers = (req, res) => {
  res.status(200).json(users);
};

exports.getUserById = (req, res) => {
  const userId = req.params.userId;
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

exports.users = users;

exports.createUser = (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newUser = {
    id: uuidv4(),
    username: value.username,
    age: value.age,
    hobbies: value.hobbies || [],
  };

  users.push(newUser);
  saveData(users);
  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const userId = req.params.userId.toLowerCase();
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const userIndex = users.findIndex((u) => u.id.toLowerCase() === userId);

  if (userIndex !== -1) {
    users[userIndex] = {
      id: userId,
      username: value.username || users[userIndex].username,
      age: value.age || users[userIndex].age,
      hobbies: value.hobbies || users[userIndex].hobbies,
    };
    saveData(users);
    res.status(200).json(users[userIndex]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

exports.deleteUser = (req, res) => {
  const userId = req.params.userId.toLowerCase();
  const userIndex = users.findIndex((u) => u.id.toLowerCase() === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    saveData(users);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};
