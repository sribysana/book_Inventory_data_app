const path = require('path');
const logger = require('./logger');

// const allPaths ={};

const books = path.join(__dirname, '../data/books.json');
logger.info('books.json path', books);
const authors = path.join(__dirname, '../data/authors.json');
logger.info('author.json path', authors);
const users = path.join(__dirname, '../data/users.json');
logger.info('users.json path', users);


module.exports = { books, authors, users };
