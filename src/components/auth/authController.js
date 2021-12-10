const authService = require('./authService');
const { apiHelper } = require('../../utils/helpers');

async function register(req, res) {
    const dataService = {
        email: req.body.email,
        password: req.body.password,
    };
    const dataRes = await authService.register(dataService);
    return res.status(201).json(apiHelper.resFormat(dataRes));
}

async function login(req, res) {
    const dataService = {
        email: req.body.email,
        password: req.body.password,
    };
    const dataRes = await authService.login(dataService);
    return res.status(200).json(apiHelper.resFormat(dataRes));
}


module.exports = {
    register,
    login,
};