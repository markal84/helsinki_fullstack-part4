/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const cors = require('cors');
require('express-async-errors');
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utilis/config');

const app = express();
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utilis/middleware');
const logger = require('./utilis/logger');

mongoose.set('strictQuery', true);

logger.info('connecting to database');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    if (process.env.NODE_ENV === 'test') {
      logger.info('connected to test database');
    } else {
      logger.info('connected to database');
    }
  })
  .catch((error) => {
    logger.error('error connecting to selected database: ', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
