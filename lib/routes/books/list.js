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
         * Cobble together query parameters so they all can be checked and matched to each item
         * on the list in one function call. For example:
         *
         * If no query were provided, `filter` will be equal to the initial function:
         *      (book) => true
         *
         * which when gets called will always return `true`.
         *
         * If `name` query were provided, `filter` will be equal to:
         *      (book) => true && book.name.toLowerCase().includes(value)
         *                ^^^^ -> return value from the previously defined, initial function
         *
         * with `value` will be replaced with the actual value of `name` query parameter. That
         * should give a sense how the rest will follow.
         *
         * So when all queries were provided, for example with these values:
         *      {
         *          name: 'een',
         *          finished: false,
         *          reading: true
         *      }
         *
         * the resulting function will be:
         *      (book) => true && book.name.toLowerCase().includes('een') &&
         *                book.finished === false && book.reading === true
         */
        const filter = Object.values(request.query).reduce((prev, predicate) => {

            return (book) => prev(book) && predicate(book);
        }, ((book) => true));

        /**
         * First we initialize `books` with [] (an empty array). For each item in `Data.books`
         * we will filter it using the aforementioned cobbled-together function. Only when the
         * return value is `true` will we be adding new object, consists of: `id`, `name`, and
         * `publisher` of a book, to the `books`.
         */
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
