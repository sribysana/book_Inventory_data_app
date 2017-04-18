const mongoose = require('mongoose');
const utils = require('util');

/* const bookSchema = require('../model/book');
const authorSchema = require('../model/author');
const userSchema = require('../model/user'); */

const logger = require('../utils/logger');

const bookDbURI = 'mongodb://localhost/bookBD';
const authorDbURI = 'mongodb://localhost/authorBD';
const userDbURI = 'mongodb://localhost/userBD';
const authorImages = 'mongodb://localhost/authorImages';
const bookCower = 'mongodb://localhost/bookCower';

mongoose.Promise = global.Promise;
/* const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
}; */

function closeConnection(funName) {
  logger.info('Mongoose default connection closing from', funName);
}

function connectDB(type) {
  let dbURI;
  const model = {};
  switch (type) {
    case 'book':
      logger.info('connecting to booksDb');
      dbURI = bookDbURI;
      break;
    case 'bookCower':
      logger.info('connecting to booksDb');
      dbURI = bookCower;
      break;
    case 'author':
      logger.info('connecting to authorBD');
      dbURI = authorDbURI;
      break;
    case 'authorImage':
      logger.info('connecting to userBD');
      dbURI = authorImages;
      break;
    case 'user':
      logger.info('connecting to userBD');
      dbURI = userDbURI;
      break;
    default:
  }

  // logger.info('DB >>>', utils.inspect(db));
  // console.log('DB ...', db);
  mongoose.connect(dbURI);
  const db = mongoose.connection;

  db.on('connected', () => {
    logger.info('Mongoose default connection open to ', dbURI);
  });

  db.on('error', (error) => {
    logger.error('Mongoose default connection error: ', error);
  });

  db.on('disconnected', () => {
    logger.info('Mongoose default connection disconnected');
  });

  process.on('SIGINT', () => {
    db.close(() => {
      closeConnection();
      process.exit(0);
    });
  });

  process.on('unhandledRejection', (reason) => {
    logger.info('unhandledRejection', reason);
  });
  return { model, db };
}


module.exports = { connectDB };
