'use strict';

const Boom = require('@hapi/boom');

/**
 *
 * @param {Boom.Boom<any>} boom
 * @param {'error'|'fail'} status
 * @param {string} message
 */
const throwBoom = (boom, status, message) => {

    boom.output.payload = {
        status,
        message,
        statusCode: undefined,
        error: undefined
    };

    throw boom;
};

/**
 *
 * @param {'error'|'fail'} status
 * @param {string} message
 */
const boomBadRequest = (status, message) => {

    throwBoom(Boom.badRequest(), status, message);
};

/**
 *
 * @param {'error'|'fail'} status
 * @param {string} message
 */
const boomInternal = (status, message) => {

    throwBoom(Boom.internal(), status, message);
};

/**
 *
 * @param {'error'|'fail'} status
 * @param {string} message
 */
const boomNotFound = (status, message) => {

    throwBoom(Boom.notFound(), status, message);
};

module.exports = {
    boomBadRequest,
    boomInternal,
    boomNotFound
};
