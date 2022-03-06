'use strict';

const {
    base,
    positiveSchema,
    bookSchema,
    commonPayloadSchema
} = require('../../data/books/schema');

const { books } = require('../../data/books');

const {
    boomBadRequest, boomInternal, boomNotFound
} = require('../../utils/responses');

module.exports = {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: (request, h) => {

        const index = books.findIndex(({ id }) => id === request.params.bookId);

        if (index < 0) {
            boomNotFound('fail', 'Id tidak ditemukan');
        }

        const updatedAt = new Date().toISOString();

        books[index] = {
            ...books[index],
            ...request.payload,
            updatedAt
        };

        return {
            status: 'success',
            message: 'Buku berhasil diperbarui'
        };
    },
    options: {
        validate: {
            params: base.keys({
                bookId: bookSchema.extract('id').messages({
                    '*': 'Id tidak ditemukan'
                })
            }),
            payload: commonPayloadSchema,
            failAction: (request, h, source, error) => {

                const boom = (key) => (key === 'bookId' // eslint-disable-line
                    ? boomNotFound
                    : boomBadRequest);

                boom(source.details[0].context.key)('fail', 'Gagal memperbarui buku. ' + source.details[0].message);
            }
        },
        response: {
            schema: positiveSchema.tailor('update'),
            failAction: (request, h, source, error) => {

                boomInternal('error', 'Buku gagal diperbarui');
            }
        }
    }
};
