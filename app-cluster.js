const cluster = require('cluster');
const os = require('os');
const redis = require('redis');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
    cluster.fork();
  });
} else {
  const client = redis.createClient();

  client.on('connect', () => {
    console.log('Connected to Redis');
  });

  require('./app');
}