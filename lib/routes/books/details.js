'use strict';

const Data = require('../../data');
const Joi = require('joi');

const {
    boomInternal,
    boomNotFound
} = require('../../responses');

module.exports = {
    method: 'GET',
    path: '/books/{bookId}',
    handler: (request, h) => {

        const book = Data.books.find((it) => it.id === request.params.bookId);

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
            params: Joi.object({
                bookId: Joi.string().length(16)
            }),
            failAction: (request, h, source, error) => {

                boomNotFound('fail', 'Buku tidak ditemukan');
            }
        },
        response: {
            schema: Joi.object({
                status: Joi.string(),
                data: {
                    book: Joi.object({
                        id: Joi.string(),
                        name: Joi.string(),
                        year: Joi.number(),
                        author: Joi.string(),
                        summary: Joi.string(),
                        publisher: Joi.string(),
                        pageCount: Joi.number(),
                        readPage: Joi.number(),
                        finished: Joi.boolean(),
                        reading: Joi.boolean(),
                        insertedAt: Joi.date(),
                        updatedAt: Joi.date()
                    })
                }
            }).presence('required'),
            failAction: (request, h, source, error) => {

                boomInternal('error', 'Gagal mengambil detail buku');
            }
        }
    }
};
