'use strict';

const {
    base,
    positiveSchema,
    bookSchema
} = require('../../data/books/schema');

const { books } = require('../../data/books');

const {
    boomInternal, boomNotFound
} = require('../../utils/responses');

module.exports = {
    method: 'GET',
    path: '/books/{bookId}',
    handler: (request, h) => {

        const book = books.find(({ id }) => id === request.params.bookId);

        if (!book) {
            boomNotFound('fail', 'Buku tidak ditemukan');
        }

        return {
            status: 'success',
            data: { book }
        };
    },
    options: {
        validate: {
            params: base.keys({
                bookId: bookSchema.extract('id').messages({
                    '*': 'Buku tidak ditemukan'
                })
            }),
            failAction: (request, h, source, error) => {

                boomNotFound('fail', 'Buku tidak ditemukan');
            }
        },
        response: {
            schema: positiveSchema.tailor('details'),
            failAction: (request, h, source, error) => {

                boomInternal('error', 'Gagal mengambil detail buku');
            }
        }
    }
};
