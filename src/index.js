const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const axios = require('axios');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');

  axios
    .put('http://localhost:9200/translationmemories')
    .then((res) => {
      if (res.acknowledged) {
        logger.info('Create translationmemories index successfully');
      }
    })
    .catch((error) => {
      console.log('elastic', error.response.data.error.reason);
    });

  axios
    .put('http://localhost:9200/term-base')
    .then((res) => {
      if (res.acknowledged) {
        logger.info('Create term-base index successfully');
      }
    })
    .catch((error) => {
      console.log('elastic', error.response.data.error.reason);
    });

  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
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
