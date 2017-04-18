const mongoose = require('mongoose');
const AuthorModel = require('../model/author');
const logger = require('./logger');
const util = require('util');

function getAuthorByQuery(query, cb) {
  AuthorModel.find(query, (error, authorData) => {
    if (error) {
      logger.error('Error Reading AuthorModel in get call :- ', util.inspect(error));
      return cb({
        success: false,
        error,
      });
    }
    const authors = authorData || [];
    logger.info('Successfully fetched  AuthorModel in  get call', authors);

    return cb({
      success: true,
      data: {
        authors,
      },
    });
  });
}

module.exports = getAuthorByQuery;
