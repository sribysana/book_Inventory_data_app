const BookModel = require('../model/book');
const logger = require('./logger');

function getBooksByQuery(query, cb) {
  BookModel.find(query, (error, booksData) => {
    if (error) {
      logger.error('Error Reading Books.json in get call :- ', util.inspect(error));
      return cb({
        success: false,
        error,
      });
    }
    const books = booksData || [];
    logger.info('Rendering success JSON data in  get call :- ', books);
    return cb({
      success: true,
      data: {
        books,
      },
    });
  });
}

module.exports = getBooksByQuery;
