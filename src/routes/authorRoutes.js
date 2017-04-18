const bodyParser = require('body-parser');
const util = require('util');
const _ = require('lodash');
const async = require('async');
const mongoose = require('mongoose');
// const uuidV4 = require('uuid/v4');

const { assign } = Object;

const logger = require('../utils/logger');
const appConstants = require('../constants');
const AuthorModel = require('../model/author');
// const BookModel = require('../model/book');
const dbConnector = require('../utils/db_connection');
const getAuthorByQuery = require('../utils/getAuthorByQuery');
const getBooksByQuery = require('../utils/getBooksByQuery');
const processIdFromQuery = require('../utils/processIdFromQuery');
const ObjectId = mongoose.Types.ObjectId;

const jsonParser = bodyParser.json();
// const { closeConnection, db } =
dbConnector.connectDB('author');
function init(app) {
  logger.info('authors routes init functionality');

  app.get('/authors', (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    logger.info('appConstants.USERS_JSON', appConstants.USERS_JSON);
    let authorQuery = req.query || {};
    authorQuery = processIdFromQuery(authorQuery);
    getAuthorByQuery(authorQuery, (authorResponse) => {
      const authors = authorResponse.data.authors.map(a => a.toObject());
      const bookDetails = {};
      async.eachOf(authors, (author, idx, asyncEachCB) => {
        const bookIds = author.books.map(e => ObjectId(e.id));
        getBooksByQuery({_id: { $in: bookIds }}, (booksRes) => {
          authors[idx].books = booksRes.data.books;
          asyncEachCB();
        });
      }, (err) => {
        if (err) {
          logger.info('Error updating authors with books');
          return res.json({
            success: false,
            data: {
              authors,
            },
          });
        }

        return res.json({
          success: true,
          data: {
            authors
          },
        });
      });

      /*
            if (queryKeys.length > 0){
              authors.map((e, i) => {
               // console.log('<<<<<<<<' + i + '>>>>>>>>>>>>');
                 console.log('authors of e &&&&&&', e);
                // console.log('books &&&&&&', e.books);
                if (e.books.length > 0) {
                  const bookIDs = e.books.map(j => ObjectId(j.id));
                  console.log('bookIds >>>>', bookIDs);
                  // const bookQuery = processIdFromQuery(e.book);
                  let bookQuery;
                  if (Array.isArray(bookIDs)) {
                    bookQuery = { _id: { $in: bookIDs } };
                  }
                  console.log('bookQuery ^^^^^^^^', bookQuery);
                  getBooksByQuery(bookQuery, (bookResponse) => {
                    console.log('bookResponse ', bookResponse);
                    authorResponceJSON.data = assign(authorResponceJSON.data, bookResponse.data);
                    console.log('authorResponse.data &&&&&&&&&& authors', !!authorResponceJSON.data.authors);
                    console.log('authorResponse.data &&&&&&&&&& books', !!authorResponceJSON.data.books);
                    // res.json(authorResponse);
                  });
                }
              });
              console.log('about to print responce');
              return res.json(authorResponceJSON);
            }
            */

    });
  });


  app.get('/authors/:id', (req, res, next) => {
    logger.info(req.method.toUpperCase(), req.path);
    const id = req.params.id;
    AuthorModel.findById(id, (error, author) => {
      if (error) {
        logger.info('Error occurred in getting a author', error);
        res.json({
          success: false,
          message: 'Error occurred in getting a author',
          error,
        });
        return false;
      }
      if (!author) {
        logger.info('No author with', id);
        res.status(400);
        res.send(`No author with ${id}`);
        const e = new Error(`No author with ${id}`);
        next(e);
      }
      logger.info('successfully received an author detail of ', id);


      res.json({
        success: true,
        message: 'Successfully retrieve a author detail',
        data: {
          author,
        },
      });
      return true;
    });
  });


  app.post('/author', jsonParser, (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    const newAuthor = new AuthorModel(req.body);
    newAuthor.save((error) => {
      logger.info('ready to add new Author');
      if (error) {
        logger.error('Error occurred in updating new Author');
        res.json({
          success: false,
          message: 'Error occurred in updating new Author',
          error,
        });
        return error;
      }

      logger.info('Succeed in creating newAuthor to authorDB');
      res.json({
        success: true,
        message: 'Succeed in creating newAuthor to authorDB',
        author: newAuthor,
      });
      return newAuthor;
    });
  });

  app.put('/author', jsonParser, (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    if (!req.body.id) {
      res.end('Error ID is must to Modify author data');
    }
    console.log('req.body.id', req.body.id);
    AuthorModel.findById(req.body.id, (error, author) => {
      if (error) {
        logger.error('Error in finding the book from  AuthorBD', error);
        res.end(error);
        return false;
      }
      const modifiedAuthor = assign(author, req.body);
      modifiedAuthor.save((err) => {
        logger.info('ready to modified author');
        if (err) {
          logger.error('Error in modified the book in AuthorDB');
          res.end(err);
          return false;
        }
        logger.info('successfully modified the book in AuthorDB', modifiedAuthor);
        res.json({
          success: true,
          message: 'successfully modified the book in AuthorDB',
          author: modifiedAuthor,
        });
        return true;
      });
      return true;
    });
  });


  app.delete('/author', jsonParser, (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    if (!req.body.id) {
      logger.error('Should Pass Id  to delete book from AuthorDB');
      res.end('Should Pass Id  to delete book from AuthorDB');
    }
    AuthorModel.findByIdAndRemove(req.body.id, (error, author) => {
      if (error) {
        logger.error('Error in Deleting book from AuthorDB', error);
        res.end('Error in Deleting book from AuthorDB');
        return false;
      }
      logger.info('successfully  deleted author from AuthorBD');
      res.json({
        success: true,
        author,
      });
    });
  });
}


module.exports = { init };
