// const fs = require('fs');
const bodyParser = require('body-parser');
const util = require('util');
// const uuidV4 = require('uuid/v4');
// const mongoose = require('mongoose');


const { assign } = Object;
const logger = require('../utils/logger');
const getBooksByQuery = require('../utils/getBooksByQuery');
const BookModel = require('../model/book');
const dbConnector = require('../utils/db_connection');
const processIdFromQuery = require('../utils/processIdFromQuery');

dbConnector.connectDB('book');
const jsonParser = bodyParser.json();
// const ObjectId = mongoose.Types.ObjectId;

function init(app) {
  logger.info('in to Books routes init function');
  app.get('/', (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    logger.info('Rendering json data in get call');
    res.json({
      success: true,
      message: 'Well come to Book inventory',
    });
  });

  app.get('/books', (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);

    let query = req.query || {};
    query = processIdFromQuery(query);

    /* if (query.id) {
      query.id = Array.isArray(query.id) ? query.id : [query.id];
    }
    if (Array.isArray(query.id)) {
      const booksIds = (query.id).map(e => ObjectId(e));
      query = { _id: { $in: booksIds } };
    }*/
    getBooksByQuery(query, (booksResponse) => {
      res.json(booksResponse);
    });
  });

  app.get('/books/:id', (req, res, next) => {
    const id = req.params.id;
    BookModel.findById({ _id: id }, (error, book) => {
      if (error) {
        logger.info('Error in finding with id', logger.info(error));
        res.json({
          success: false,
          message: 'Error in finding with id',
          error,
        });
        return false;
      }
      if (!book) {
        logger.info('No book with', id);
        res.status(400);
        res.send(`No book with ${id}`);
        const e = new Error(`No book with ${id}`);
        next(e);
      }

      logger.info(`Succeed in getting the book with ${id}`, book);
      res.json({
        success: true,
        data: {
          book,
        },
      });
      return true;
    });
  });

  app.post('/book', jsonParser, (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    const newBook = new BookModel(req.body);
    newBook.save((error) => {
      logger.info('started changing book details');
      if (error) {
        logger.error('Error occurred in creating a book', error);
        res.json({
          success: false,
          message: 'Error occurred in creating a book',
          error,
        });
        return false;
      }
      logger.info('Succeed in creating newBook to BookDB');
      res.json({
        success: true,
        message: 'added one book',
        data: {
          book: newBook,
        },
      });
      return true;
    });
  });

  app.put('/book', jsonParser, (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);

    if (req.body.id) {
      BookModel.findById({ _id: req.body.id }, (error, book) => {
        if (error) {
          logger.error('Error in finding the book from  BookBD', error);
          res.json({
            success: false,
            message: 'Error in finding the book from  BookBD',
            error,
          });
          return false;
        }
        logger.info('Finding the book from  BookBD', book);
        const modifiedBook = assign(book, req.body);
        modifiedBook.save((err) => {
          if (err) {
            logger.error('Error in modified the book in BookDB');
            res.end();
          }
          logger.info('successfully modified the book in BookDB', modifiedBook);
          res.json({
            success: true,
            message: 'successfully modified the book in BookDB',
            book: modifiedBook,
          });
        });
        return true;
      });
    } else res.end('Should Pass Id  to modify book data');
  });

  app.delete('/book', jsonParser, (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    if (!req.body.id) {
      logger.error('Should Pass Id  to delete book from BookDB');
      res.end('Should Pass Id  to delete book data');
      return false;
    }
    BookModel.findByIdAndRemove(req.body.id, (error, book) => {
      if (error) {
        logger.error('Error in Deleting book from BooksDB');
        res.end(error);
      }
      logger.info('successfully deleted book from BookBD');
      res.json({
        success: true,
        book,
      });
      return true;
    });
    return true;
  });
}

module.exports = {
  init,
};

/*

http://localhost:2020/books?id=58ebbaa730f66128b28c3a7d&id=58ebbacb30f66128b28c3a81
http://localhost:2020/books?id=95f5b406-f2af-45ba-b2fe-fc3e5b7d9568

*/
