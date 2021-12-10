const charactersService = require('./charactersService');
const { apiHelper } = require('../../utils/helpers');

const getAll = async (req, res) => {
    const dataRes = await charactersService.getAll();
    return res.status(200).json(apiHelper.resFormat(dataRes));
};


module.exports = {
    getAll,
};