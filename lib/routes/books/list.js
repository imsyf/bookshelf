'use strict';

const {
    positiveSchema,
    filterSchema
} = require('../../data/books/schema');

const Data = require('../../data/books');

const {
    boomBadRequest, boomInternal
} = require('../../utils/responses');

module.exports = {
    method: 'GET',
    path: '/books',
    handler: (request, h) => {

        /**
         * Cobble together query parameters so they all can be checked and matched to each item on
         * the list in one function call. If no query were provided it will always return `true`.
         */
        const filter = Object.values(request.query).reduce((prev, predicate) => {

            return (book) => prev(book) && predicate(book);
        }, ((book) => true));

        const books = Data.books.reduce((result, it) => {

            if (filter(it)) {
                result.push({
                    id: it.id,
                    name: it.name,
                    publisher: it.publisher
                });
            }

            return result;
        }, []);

        return {
            status: 'success',
            data: { books }
        };
    },
    options: {
        validate: {
            query: filterSchema,
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
