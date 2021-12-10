const express = require('express');
const cors = require('cors');
const { httpLogger } = require('../utils/loggers');
const { errorHandler, AppError } = require('../utils/errorsManagment');
const config = require('../config');

// Import Routes
const routes = [];
routes.push(require('../components/auth').routes);
routes.push(require('../components/characters').routes);
//routes.push(require('../components/').routes);

// Create app
const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(httpLogger);

// Static files
app.use(config.app.staticRout, express.static(`${__dirname}/../../public`));

// Routes
routes.forEach(rout => {
    app.use(`${config.app.apiRout}${rout.baseRout}`, rout.router);
});

// url not hosted handler
app.use((req, res, next) => {
    const err = new AppError('Route not found', 404);
    next(err);
});

// Errors
app.use(async (err, req, res, next) => {
    await errorHandler.handleError(err, res);
});

// Export
module.exports = app;