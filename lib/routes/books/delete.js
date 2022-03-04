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
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: (request, h) => {

        const index = books.findIndex(({ id }) => id === request.params.bookId);

        if (index < 0) {
            boomNotFound('fail', 'Buku gagal dihapus. Id tidak ditemukan');
        }

        books.splice(index, 1);

        return {
            status: 'success',
            message: 'Buku berhasil dihapus'
        };
    },
    options: {
        validate: {
            params: base.keys({
                bookId: bookSchema.extract('id').messages({
                    '*': 'Id tidak ditemukan'
                })
            }),
            failAction: (request, h, source, error) => {

                boomNotFound('fail', 'Buku gagal dihapus. ' + source.details[0].message);
            }
        },
        response: {
            schema: positiveSchema.tailor('delete'),
            failAction: (request, h, source, error) => {

                boomInternal('error', 'Buku gagal dihapus');
            }
        }
    }
};
