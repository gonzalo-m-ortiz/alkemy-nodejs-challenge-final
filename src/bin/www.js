const http = require('http');
const app = require('../server');
const { logger } = require('../utils/loggers');
const { errorHandler } = require('../utils/errorsManagment');
const config = require('../config');

const server = http.createServer(app);

server.listen(config.app.port);

server.on('listening', () => {
    const address = server.address();
    const url = typeof address === 'string' ? `${address}` : `http://localhost:${address.port}`

    // setting static adress for files sharing. 'http://localhost:3000/static'
    config.app.staticAddress = url + config.app.staticRout;

    logger.info(`Server listening on ${url}`);
});

server.on('error', async (error) => {
    await errorHandler.handleError(error);
});

// uncaught errors
process.on("uncaughtException", async (error) => {
    await errorHandler.handleError(error);
});
  
process.on("unhandledRejection", async (reason) => {
    await errorHandler.handleError(reason);
});