// const fs = require('fs');
const bodyParser = require('body-parser');
const util = require('util');
// const uuidV4 = require('uuid/v4');
// const mongoose = require('mongoose');

// const {assign} = Object;

const logger = require('../utils/logger');
const userModel = require('../model/user');
const dbConnector = require('../utils/db_connection');

// const { closeConnection, db } =

dbConnector.connectDB('user');

// const validateSchema = require('../util/validateSchema');

const jsonParser = bodyParser.json();
// mongoose.Promise = global.Promise;


function init(app) {
  // '/users/name'
  // logger.info('',util.inspect());

  app.get('/users', (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    userModel.find((error, userInfo) => {
      if (error) {
        logger.error('Error occurred in getting users info', error);
        return res.end(error);
      }
      logger.info('Success in getting authors info', util.inspect(userInfo));
      res.json({
        success: true,
        data: {
          users: userInfo,
        },
      });
      return userInfo;
    });
  });

  app.get('/users/:id', (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    const userId = req.params.id;
    console.log('user id >>>', userId);
    // userModel.find({ name }, (error, user) => {
    userModel.findById(userId, (error, user) => {
      console.log('user >>>', user);
      if (error) {
        console.log('Error in getting ', userId);
        res.error('Error in getting ', error);
        return false;
      }
      if (!user || user.length < 1) {
        logger.info('NO user found ');
        res.json({
          success: false,
          message: 'NO user found',
        });
        return false;
      }
      logger.info('Success in retrieving users', user.name);
      return res.json({
        success: true,
        user,
      });
    });
  });

  app.put('/addToCart', jsonParser, (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    const userID = req.body.userID;
    const productId = req.body.productId;
    userModel.findById(userID, (error, user) => {
      console.log(user);
      if (error) {
        res.end('Error in getting user');
      }
      logger.info('succeed in finding user', user);
      console.log('user ::::', user);
      if (user.length < 1) {
        logger.info('no users with this id');
        res.json({
          success: false,
          message: 'no users with this id',
        });
      }
      const cart = user.cart;
      const product = cart.find(e => e.id === productId);
      if (product) {
        product.count += 1;
      } else {
        user.cart.push({ id: productId, count: 1 });
      }
      user.save((err) => {
        if (err) {
          logger.error('Error in saving modified cart');
          res.json({
            success: false,
            err,
          });
          return false;
        }
        res.json({
          success: true,
          user,
        });
        return true;
      });
    });
  });

  app.put('/removeFromCart', jsonParser, (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);
    const userID = req.body.userID;
    const productId = req.body.productId;
    userModel.findById(userID, (error, user) => {
      if (error) {
        logger.info('Error in finding user ');
        res.json({
          success: false,
          message: 'Error in finding user',
          error,
        });
        return false;
      }
      logger.info('Successfully found the user');
      console.log('user >>>', user);
      console.log('productId >>>', productId);
      const removable = user.cart.find((e, i) => {
        if (e.id === productId) {
          return [e, i];
        }
        return false;
      });
      console.log('removable >>>>>', removable)

      if (removable) {
        console.log('removeables >>>', removable)
        if (removable.count > 1) {
          removable.count -= 1;
        } else {
          user.cart.splice(removable, 1);
        }
      } else {
        res.json({
          success: false,
          message: 'no cart added with this id',
        });
        return false;
      }
      user.save((err) => {
        if (err) {
          logger.info('Error in saving deleted');
          res.json({
            success: false,
            err,
          });
          return false;
        }
        logger.info('Successfully saved cart after deleting');
        res.json({
          success: true,
          user,
        });
      });
    });
  });
  app.post('/addUser', jsonParser, (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);

    userModel.create(req.body, (error, user) => {
      if (error) {
        logger.error('Error occurred in updating new User');
        return res.end(error);
      }

      logger.info('Succeed in creating newAuthor to userBD');
      res.json({
        success: true,
        message: 'Succeed in creating newAuthor to userBD',
        user,
      });
      return user;
    });
  });

  app.delete('/removeUser', jsonParser, (req, res) => {
    logger.info(req.method.toUpperCase(), req.path);

    if (!req.body.id) {
      logger.error('Should Pass Id  to delete book from userBD');
      res.end('Should Pass Id  to delete book from userBD');
    }

    userModel.findByIdAndRemove(req.body.id, (error, user) => {
      if (error) {
        logger.error('Error in Deleting book from userBD', error);
      }
      logger.info('successfully  deleted author from userBD');
      res.json({
        success: true,
        user,
      });
    });
  });
}
module.exports = {init};
