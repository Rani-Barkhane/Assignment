const cluster = require('cluster');
const os = require('os');
const express = require('express');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const usersController = require('./controllers/usersController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; // Port for load balancer

// Check if the current process is the master process
if (cluster.isMaster) {
  // Get the number of available CPUs
  const numCPUs = os.cpus().length;

  // Fork workers equal to the number of available CPUs - 1
  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  // Handle the exit of a worker process
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Optionally, restart the worker
    cluster.fork();
  });
} else {
  // This code is executed in each worker process

  app.use(express.json());

  // Middleware to validate UUID
  const validateUUID = (req, res, next) => {
    const userId = req.params.userId;
    if (!userId || typeof userId !== 'string' || !uuidv4(userId)) {
      return res.status(400).json({ error: 'Invalid or missing user ID' });
    }

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
  app.listen(PORT + cluster.worker.id, () => {
    console.log(`Worker ${process.pid} is running on http://localhost:${PORT + cluster.worker.id}`);
  });
}

module.exports = app;