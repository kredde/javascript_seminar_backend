const socketIo = require('socket.io');
const mongoose = require('mongoose');

const fs = require('fs');
const spdy = require('spdy');
const app = require('./app');

const config = require('./config/config');
const logger = require('./config/logger');
const games = require('./utils/gameLogic.js');

let server;

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');

  if (config.https === 'true') {
    const options = {
      key: fs.readFileSync(config.bbbKey),
      cert: fs.readFileSync(config.bbbCert)
    };

    spdy.createServer(options, app).listen(config.port, (err) => {
      if (err) {
        logger.error(err);
        return process.exit(1);
      }
      logger.info(`Listening on port ${config.port}`);
    });
  } else {
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  }

  // GAMES SOCKET
  const io = socketIo.listen(server);
  games.gameInit(io);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
