'use strict';

const {
    positiveSchema
} = require('../../data/books/schema');

const Data = require('../../data/books');

const {
    boomBadRequest, boomInternal
} = require('../../utils/responses');

module.exports = {
    method: 'GET',
    path: '/books',
    handler: (request, h) => {

        const books = Data.books
            .map(({ id, name, publisher }) => ({ id, name, publisher }));

        return {
            status: 'success',
            data: { books }
        };
    },
    options: {
        validate: {
            // query: ,
            failAction: (request, h, source, error) => {

                boomBadRequest('fail', source.details[0].message);
            }
        },
        response: {
            schema: positiveSchema.tailor('list'),
            failAction: (request, h, source, error) => {

                boomInternal('error', 'Gagal mengambil daftar buku');
            }
        }
    }
};
