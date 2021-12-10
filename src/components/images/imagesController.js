const imagesService = require('./imagesService');
const { apiHelper } = require('../../utils/helpers');

const create = async (req, res) => {
    // localFolder and fileName added in multerHelper.js
    // entityType added in imageRoutes.js
    const dataService = apiHelper.extract(req.body, ['localFolder', 'fileName', 'entityType']);
    const dataRes = await imagesService.create(dataService);
    return res.status(201).json(apiHelper.resFormat(dataRes));
};

const putById = async (req, res) => {
    // localFolder and fileName added in multerHelper.js
    const dataService = apiHelper.extract(req.body, ['localFolder', 'fileName']);
    dataService.id = req.params.id;
    const dataRes = await imagesService.putById(dataService);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const deleteById = async (req, res) => {
    const { id } = req.params;
    const dataRes = await imagesService.deleteById(id);
    return res.status(200).json(apiHelper.resFormat(dataRes));
};

const getLocalFolder = async (id) => {
    const localFolder = await imagesService.getLocalFolder(id);
    return localFolder;
};


module.exports = {
    create,
    putById,
    deleteById,
    getLocalFolder,
};