const {AppError} = require('../../utils/errorsManagment');
const authService = require('./authService');

const isAuthenticated = (req, res, next) => {
    try{
        const token = req.headers["x-access-token"] || req.headers.token ||  req.body.token;
        if (!token) 
            throw new AppError('Auth required', 403);
        try {
            const decoded = authService.verifyToken(token);
            req.user = decoded;
            return next();
        } catch(e) {
            throw new AppError('Invalid Token', 401);
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    isAuthenticated,
};