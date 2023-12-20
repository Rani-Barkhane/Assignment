const express = require('express');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const usersController = require('./controllers/usersController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Middleware to validate UUID
const validateUUID = (req, res, next) => {
  const userId = req.params.userId;

  if (!userId || typeof userId !== 'string' || !uuidv4(userId)) {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }

  // // Validate if userId exists in the data (using the imported users array)
  // const userExists = usersController.users.some((user) => user.id === userId);

  // if (!userExists) {
  //   return res.status(404).json({ error: 'User not found' });
  // }

  next();
};

// Routes
app.get('/api/users', usersController.getAllUsers);
app.get('/api/users/:userId', validateUUID, usersController.getUserById);
app.post('/api/users', usersController.createUser);
app.put('/api/users/:userId', validateUUID, usersController.updateUser);
app.delete('/api/users/:userId', validateUUID, usersController.deleteUser);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
