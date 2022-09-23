const express = require("express");
const app = express();
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
let server = null;

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running.`);

//   for (let i = 0; i < 1; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died.`);
//     cluster.fork();
//   });

//   cluster.on('online', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} is running`);
//   });
// } else {
const logger = require("./logging");
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8080;
server = app.listen(PORT, () => {
  logger.info(`Listening at http://localhost:${PORT}`);
});

// app.use('/static', express.static('public'));
// console.log(`Worker ${process.pid} started`);
// }

module.exports = {
  app: app,
  server: server
};
