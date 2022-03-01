'use strict';

const Boom = require('@hapi/boom');
const Data = require('../../data');
const Joi = require('joi');

const toBool = (value, helpers) => {

    if (value !== '0' && value !== '1') {
        return helpers.message('Kueri {{#label}} hanya boleh bernilai 0 atau 1');
    }

    return value === '1';
};

module.exports = {
    method: 'GET',
    path: '/books',
    handler: (request, h) => {

        const books = [];

        for (const item of Data.books) {
            if (request.query.name !== undefined) {
                if (!item.name.toLowerCase().includes(request.query.name)) {
                    continue;
                }
            }

            if (request.query.finished !== undefined) {
                if (item.finished !== request.query.finished) {
                    continue;
                }
            }

            if (request.query.reading !== undefined) {
                if (item.reading !== request.query.reading) {
                    continue;
                }
            }

            books.push({
                id: item.id,
                name: item.name,
                publisher: item.publisher
            });
        }

        return {
            status: 'success',
            data: { books }
        };
    },
    options: {
        validate: {
            query: Joi.object({
                name: Joi.string().trim().min(3).alphanum().lowercase(),
                reading: Joi.string().trim().custom(toBool),
                finished: Joi.string().trim().custom(toBool)
            }).messages({
                'string.empty': 'Kueri {{#label}} tidak boleh kosong',
                'string.min': 'Kueri {{#label}} minimal terdiri dari 3 karakter',
                'string.alphanum': 'Kueri {{#label}} hanya boleh terdiri dari angka dan huruf'
            }).options({
                abortEarly: true,
                allowUnknown: true
            }),
            failAction: (request, h, source, error) => {

                const boom = Boom.badRequest();
                boom.output.payload = {
                    status: 'error',
                    message: source.details[0].message
                };

                throw boom;
            }
        },
        response: {
            schema: Joi.object({
                status: Joi.string(),
                data: {
                    books: Joi.array().items(
                        Joi.object({
                            id: Joi.string(),
                            name: Joi.string(),
                            publisher: Joi.string()
                        })
                    )
                }
            }).presence('required'),
            failAction: (request, h, source, error) => {

                const boom = Boom.internal();
                boom.output.payload = {
                    status: 'error',
                    message: 'Gagal mengambil daftar buku'
                };

                throw boom;
            }
        }
    }
};
