const pino = require('pino');

const logger = pino({
    // Config pino here
});

module.exports = logger;