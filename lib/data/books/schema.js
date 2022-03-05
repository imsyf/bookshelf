'use strict';

const Joi = require('joi');

const base = Joi.object();

const positiveSchema = base.keys({
    status: Joi.valid('success').required(),
    message: Joi.string().alter({
        add: (schema) => schema.valid('Buku berhasil ditambahkan').required(),
        delete: (schema) => schema.valid('Buku berhasil dihapus').required(),
        details: (schema) => schema.forbidden(),
        list: (schema) => schema.forbidden(),
        update: (schema) => schema.valid('Buku berhasil diperbarui').required()
    }),
    data: base.alter({
        add: (schema) => schema.keys({ bookId: bookSchema.extract('id') }).required(),
        delete: (schema) => schema.forbidden(),
        details: (schema) => schema.keys({ book: bookSchema }).required(),
        list: (schema) => schema.keys({ // eslint-disable-line
            books: Joi.array().items(base.keys({
                id: bookSchema.extract('id'),
                name: bookSchema.extract('name'),
                publisher: bookSchema.extract('publisher')
            }))
        }).required(),
        update: (schema) => schema.forbidden()
    })
});

const bookSchema = base.keys({
    id: Joi.string().alphanum().length(16).required(),
    name: Joi.string().trim().required(),
    year: Joi.number()
        .min(1488) // the year oldest book publisher founded in (https://en.wikipedia.org/wiki/Schwabe_(publisher))
        .max(new Date().getFullYear()),
    author: Joi.string().trim(),
    summary: Joi.string().trim(),
    publisher: Joi.string().trim(),
    pageCount: Joi.number()
        /**
         * Avoid negative number and prevent it from having `0` as value which could lead to illogical condition of
         * `finished` being equal to `true` when the value of `pageCount` is also `0`.
         */
        .min(1),
    readPage: Joi.number().min(0)
        .max(Joi.ref('pageCount')), // can't be greater than `pageCount`
    finished: Joi.boolean()
    /**
     * Now this is me overcompensating. I know we don't even let users to set the value of `finished` and instead
     * it's derived from `readPage` === `pageCount` expression which runs on the server. But why stop there when
     * you can make sure `finished` is only allowed to receive a boolean of `true` when the value of `readPage` is
     * equal to the value of `pageCount`, otherwise it's only allowed to receive a boolean of `false`?
     *
     * If that sounds like a broken logic on the `false` part, it's because it is. Unfortunately Joi can only check
     * equality and inequality of a field, so the `false` part will be valid regardless the value of `pageCount` is
     * greater or less than the value of `pageCount`. But don't worry, `readPage` validation would never allow it to
     * receive a value greater than the value of `pageCount`.
     */
        .when('readPage', {
            is: Joi.ref('pageCount'),
            then: Joi.valid(true),
            otherwise: Joi.valid(false)
        }),
    reading: Joi.boolean().default(false),
    insertedAt: Joi.date().required(),
    updatedAt: Joi.date().required()
})
    /**
     * If `readPage` exists, so must `pageCount` so the value of `finished` can be derived from, but not vice versa.
     * Because `pageCount` can exists even if `readPage` doesn't.
     */
    .with('readPage', 'pageCount')
    /**
     * `finished` must only exist if `readPage` exists, which incidentally will also require `pageCount` to exist.
     * Conversely, `finished` must not exist if `readPage` doesn't. That way `finished` can only, and even must, be
     * introduced if we have all the necessary fields to correctly compute a value for it.
     */
    .and('finished', 'readPage')
    .options({
        abortEarly: false
    });

const skewedBoolean = Joi.boolean().falsy(0, '0').truthy(1, '1');
const filterSchema = base.keys({
    name: Joi.string().trim().min(3).alphanum().lowercase(),
    finished: skewedBoolean,
    reading: skewedBoolean
});

const arrayOfBooksSchema = Joi.array().items(bookSchema);

module.exports = {
    base,
    positiveSchema,
    bookSchema,
    filterSchema,
    arrayOfBooksSchema
};
