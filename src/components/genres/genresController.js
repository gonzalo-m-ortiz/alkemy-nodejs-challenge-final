const genresService = require('./genresService');
const { apiHelper } = require('../../utils/helpers');

const getAll = async (req, res) => {
    const dataRes = await genresService.getAll();
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const getById = async (req, res) => {
    const { id } = req.params;
    const dataRes = await genresService.getById(id);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const create = async (req, res) => {
    const dataService = apiHelper.extract(req.body, ['name', 'movies', 'imageId']);
    const dataRes = await genresService.create(dataService);
    return res.status(201).json(apiHelper.resFormat(dataRes));
};

const patchById = async (req, res) => {
    const dataService = apiHelper.extract(req.body, ['name', 'imageId', 'movies', 'moviesAction']);
    dataService.id = req.params.id;
    const dataRes = await genresService.patchById(dataService);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const deleteById = async (req, res) => {
    const { id } = req.params;
    const dataRes = await genresService.deleteById(id);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};


module.exports = {
    getAll,
    getById,
    create,
    patchById,
    deleteById,
};