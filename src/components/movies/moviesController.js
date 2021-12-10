const moviesService = require('./moviesService');
const { apiHelper } = require('../../utils/helpers');

const getAll = async (req, res) => {
    const dataService = apiHelper.extract(req.query, ['name', 'genre', 'order']);
    const dataRes = await moviesService.getAll(dataService);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const getById = async (req, res) => {
    const { id } = req.params;
    const dataRes = await moviesService.getById(id);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const create = async (req, res) => {
    const dataService = apiHelper.extract(req.body, 
        ['title', 'releaseDate', 'rating', 'genres', 'characters','imageId']);
    const dataRes = await moviesService.create(dataService);
    return res.status(201).json(apiHelper.resFormat(dataRes));
};

const patchById = async (req, res) => {
    const dataService = apiHelper.extract(req.body, 
        ['title', 'releaseDate', 'rating', 'imageId', 'genres', 'genresAction', 'characters', 'charactersAction']);
    dataService.id = req.params.id;
    const dataRes = await moviesService.patchById(dataService);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const deleteById = async (req, res) => {
    const { id } = req.params;
    const dataRes = await moviesService.deleteById(id);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};


module.exports = {
    getAll,
    getById,
    create,
    patchById,
    deleteById,
};