const pinoHttp = require('pino-http');

const logger = require('./logger');

const httpLogger = pinoHttp({
    logger,
    // Config here
});

module.exports = httpLogger;
