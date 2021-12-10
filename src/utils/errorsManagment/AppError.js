class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {

        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;
    }
}

module.exports = AppError;