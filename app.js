const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const usersController = require('./controllers/usersController');
const cluster = require('cluster')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; // Port for load balancer

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// Middleware to validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const userId = req.params.userId;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }

  next();
};

// Routes
app.get('/api/users', usersController.getAllUsers);
app.get('/api/users/:userId', validateObjectId, usersController.getUserById);
app.post('/api/users', usersController.createUser);
app.put('/api/users/:userId', validateObjectId, usersController.updateUser);
app.delete('/api/users/:userId', validateObjectId, usersController.deleteUser);

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
if (cluster.worker) {
  app.listen(PORT + cluster.worker.id, () => {
    console.log(`Worker ${process.pid} is running on http://localhost:${PORT + cluster.worker.id}`);
  });
}else{
  console.log(`Server is running on http://localhost:${PORT}`);
}

// Export the app for testing purposes
module.exports = app;
