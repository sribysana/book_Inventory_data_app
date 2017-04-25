// const mongoose = require('mongoose');

const AuthorModel = require('../model/author');
const logger = require('./logger');
const util = require('util');


function mapAuthorIdToBook(book, cb) {
  const modifiedBook = book;
  AuthorModel.find({}, (error, authorsCollection) => {
    if (error) {
      logger.info('Error occurred in fetching book data', util.inspect(error));
      return false;
    }
    // map ids of authors to ides in books authors
    modifiedBook.authors = book.authors.map((e) => {
      const authorDetail = authorsCollection.find(autinfo => autinfo.name === e.name);
      e.id = authorDetail._id;
      return e;
    });
    cb(modifiedBook);
    return modifiedBook;
  });
  return modifiedBook;
}

module.exports = mapAuthorIdToBook;

/*
 const authorObj = {
 name: '',
 id: '',
 rating: 0,
 biography: '',
 avatar: {
 img: '',
 },
 books: [
 {
 name: '',
 id: '',
 },
 ],
 img: '',
 }
 */

