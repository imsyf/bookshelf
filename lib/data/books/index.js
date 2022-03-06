'use strict';

const { arrayOfBooksSchema } = require('./schema');

const books = [];

/**
 * Validate initial data using the predefined schema
 */
arrayOfBooksSchema.validateAsync(books)
    .catch(console.log);

module.exports = {
    books
};
