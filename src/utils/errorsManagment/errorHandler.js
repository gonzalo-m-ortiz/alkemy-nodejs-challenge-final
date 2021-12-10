const { logger } = require('../loggers');

const isTrustedError = (err) => {
    return err.isOperational || (err.statusCode >= 400 && err.statusCode < 500);
};

const handleUntrustedErrors = async (err) => {
    logger.fatal("Shutting down");
    process.exit(1);
};

const returnResponse = (err, res) => {
    const statusCode = err.statusCode || 500;
    if (statusCode < 500) {
        return res.status(statusCode).json({
            type:'error',
            message: err.message,
            data: null,
        });
    } else {
        return res.status(statusCode).json({
            type:'error',
            message: 'Server failed handle your request',
            data: null,
        });
    }
};

const logError = async (err) => {
    if (isTrustedError(err)) {
        if (err.statusCode < 500) {
            logger.warn(`${err.statusCode} ${err.message}`);
        } else if (err.statusCode >= 500) {
            logger.error(`${err.statusCode} ${err.message}`);
        }  
    } else {
        logger.fatal(err);
    }
};

const handleError = async (err, res) => {

    await logError(err);

    if (isTrustedError(err)) {
        return returnResponse(err, res);
    } else {
        await handleUntrustedErrors(err);
    }
};

const handleMinorError = async (err) => {
    await logError(err);
};


module.exports = {
    handleError,
    handleMinorError,
};