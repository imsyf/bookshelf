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

        const books = Data.books
            .filter((it) => {

                const shouldWeKeepIt = Object.entries(request.query)
                    .reduce((prev, [key, value]) => {

                        const queryCheckResult = key === 'name'
                            ? it.name.toLowerCase().includes(value)
                            : ['finished', 'reading'].includes(key)
                                ? it[key] === value
                                : false;

                        return prev && queryCheckResult;
                    }, true);

                return shouldWeKeepIt;
            })
            .map(({ id, name, publisher }) => ({ id, name, publisher }));

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
