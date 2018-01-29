const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./app/router');
const errorHandler = require('./app/middleware/error');
const {setDatabase} = require('./app/repository/mongo');
const {openDbConnection} = require('./app/repository/connect');

const packageJson = require('./package.json');

const port = parseInt(process.argv[2], 10) || 8000;
const app = express();
const server = http.createServer(app);

app.set('port', port);
app.use(bodyParser.json());

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const address = server.address();
  const bind = typeof server.address() === 'string' ? `pipe ${address}` : `port ${address.port}`;
  console.log(`${packageJson.name} version ${packageJson.version} started on ${bind}`);
}

server.on('error', onError);
server.on('listening', onListening);

(async () => {
  // Инициализировать подключение к БД
  setDatabase(await openDbConnection());

  app.use(router);
  app.use(errorHandler());

  server.listen(port);
})();
