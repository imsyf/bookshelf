'use strict';

const {
    base,
    positiveSchema,
    bookSchema
} = require('../../data/books/schema');

const { books } = require('../../data/books');

const {
    boomBadRequest, boomInternal
} = require('../../utils/responses');

const { generateToken } = require('../../utils/token');

module.exports = {
    method: 'POST',
    path: '/books',
    handler: (request, h) => {

        const insertedAt = new Date().toISOString();

        const book = {
            /**
             * Will generate 16 alphanumeric random characters, leaving out '-' (dash) and '_' (underscore) which
             * both are part of the default nanoid roster because of the potential issue they may cause.
             * See: https://github.com/ai/nanoid/issues/347
             */
            id: generateToken(),
            /**
             * Due to a very strict validation scheme, we can be sure only allowed and valid JSON key and value
             * pairs will end up here. So we can just spread the payload object directly here and be confident
             * everything will match up to the book schema. There should be no worry about unknown or unexpected
             * properties.
             */
            ...request.payload,
            insertedAt,
            updatedAt: insertedAt
        };

        /**
         * Add `finished` property if both `readPage` and, incidentally, `pageCount` exist.
         * This will also prevent a nonsensical condition of `finished` being equal to `true`
         * when both the value of `pageCount` and `readPage` are `undefined` because users
         * don't provide them.
         */
        if (book.readPage !== undefined) {
            book.finished = book.pageCount === book.readPage;
        }

        books.push(book);

        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: book.id
            }
        }).code(201);
    },
    options: {
        validate: {
            payload: base.keys({
                name: bookSchema.extract('name').messages({
                    'string.empty': 'Mohon isi nama buku'
                }),
                year: bookSchema.extract('year'),
                author: bookSchema.extract('author'),
                summary: bookSchema.extract('summary'),
                publisher: bookSchema.extract('publisher'),
                pageCount: bookSchema.extract('pageCount'),
                readPage: bookSchema.extract('readPage').messages({
                    'number.max': 'readPage tidak boleh lebih besar dari pageCount'
                }),
                reading: bookSchema.extract('reading')
            }),
            failAction: (request, h, source, error) => {

                boomBadRequest('fail', 'Gagal menambahkan buku. ' + source.details[0].message);
            }
        },
        response: {
            schema: positiveSchema.tailor('add'),
            failAction: (request, h, source, error) => {

                boomInternal('error', 'Buku gagal ditambahkan');
            }
        }
    }
};
