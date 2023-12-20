const cluster = require('cluster');
const os = require('os');

// Check if the current process is the master process
if (cluster.isMaster) {
  // Get the number of available CPUs
  const numCPUs = os.cpus().length;

  // Fork workers equal to the number of available CPUs - 1
  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  // Handle the event when a worker exits
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
    // Fork a new worker to replace the exited one
    cluster.fork();
  });
} else {
  // This code is executed in each worker process
  require('./app');
}
