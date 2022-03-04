'use strict';

const { customAlphabet } = require('nanoid');

const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';

const generateToken = () => customAlphabet(lowercase + uppercase + numbers, 16)();

module.exports = {
    generateToken
};
