const charactersService = require('./charactersService');
const { apiHelper } = require('../../utils/helpers');

const getAll = async (req, res) => {
    const dataService = apiHelper.extract(req.query, ['name', 'age', 'weight', 'movies']);
    const dataRes = await charactersService.getAll(dataService);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const getById = async (req, res) => {
    const { id } = req.params;
    const dataRes = await charactersService.getById(id);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const create = async (req, res) => {
    const dataService = apiHelper.extract(req.body, ['name', 'age', 'weight', 'story', 'movies','imageId']);
    const dataRes = await charactersService.create(dataService);
    return res.status(201).json(apiHelper.resFormat(dataRes));
};

const patchById = async (req, res) => {
    const dataService = apiHelper.extract(req.body, ['name', 'age', 'weight', 'story', 'imageId', 'movies', 'moviesAction']);
    dataService.id = req.params.id;
    const dataRes = await charactersService.patchById(dataService);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const deleteById = async (req, res) => {
    const { id } = req.params;
    const dataRes = await charactersService.deleteById(id);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

module.exports = {
    getAll,
    getById,
    create,
    patchById,
    deleteById,
};