const Joi = require('joi');
const { Op } = require('sequelize');

const {models} = require('../../db');
const {AppError} = require('../../utils/errorsManagment');
const {validateHelper} = require('../../utils/helpers');
const {schemas:characterSchema} = require('./CharacterModel');
const commonSchemas = require('../common/schemas');
const { apiHelper } = require('../../utils/helpers');

const getAll = async () => {
    // get characters list
    const characters = await models.Character.findAll({
        attributes: ['id','name'],
        include: [
            {
                model: models.Image, as: 'image',
                attributes: ['url'],
            },
        ]
    });
    return characters;
}

module.exports = {
    getAll,
};