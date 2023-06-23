const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const axios = require('axios');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, async () => {
    logger.info(`Listening to port ${config.port}`);
    let checkConnectElasticSearch = true;
    try {
      await axios.get(`http://localhost:9200`); //checkConnect
    } catch (err) {
      logger.error(`Your elasticsearch is not ready to connect !!!!`);
      checkConnectElasticSearch = false;
    }
    if (checkConnectElasticSearch) {
      try {
        await axios.get(`http://localhost:9200/term-base`); // check exit index term-base
        await axios.get(`http://localhost:9200/translationmemories`); // check exit index translationmemories
      } catch (err) {
        try {
          await axios.put(`http://localhost:9200/term-base`);
          await axios.put(`http://localhost:9200/translationmemories`);
          logger.info('Create index to elasticsearch successfully');
        } catch (err) {
          logger.info('System cannot create index to elasticsearch');
        }
      }
    }
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
