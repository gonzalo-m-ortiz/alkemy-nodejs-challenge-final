const Joi = require('joi');
const { Op } = require('sequelize');

const {models} = require('../../db');
const {AppError} = require('../../utils/errorsManagment');
const {validateHelper} = require('../../utils/helpers');
const {schemas:characterSchema} = require('./CharacterModel');
const commonSchemas = require('../common/schemas');
const { apiHelper } = require('../../utils/helpers');

const imagesService = require('../images/imagesService');
const commonService = require('../common/commonService');

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

const create = async (dataRec) => {
    // validate data
    const characterData = await validateChar(dataRec);

    // splite movies from character
    const movies = characterData.movies;
    delete characterData.movies;

    // if movies provided, check if exists
    if (movies) {
        const [ movieIdNotFound, result ] = await commonService.entitiesExist(models.Movie, movies);
        if (movieIdNotFound)
            throw new AppError(`Movie with id ${movieIdNotFound} not found. Character not created`, 404);
    }

    // if imageId provided, check if is 'character image' and not being used
    if (characterData.imageId) {
        const [ imageNotFound, imageUsed] = await imagesService.imageBeingUsed(characterData.imageId);
        const [ imageNotFound2, imageMatchEntityType] = await imagesService.imageMatchEntityType(characterData.imageId, 'character');
        if (imageNotFound) 
            throw new AppError(`Image with id ${characterData.imageId} not found. Character not created`, 404);
        if (imageUsed) 
            throw new AppError(`Image with id ${characterData.imageId} already being used. Character not created`, 409);
        if (!imageMatchEntityType)
            throw new AppError(`Image with id ${characterData.imageId} is not a "character image". Character not created`, 400);
    }

    // create character
    const characterCreated = await models.Character.create(characterData);

    // if imageId provided, mark is being used
    if (characterData.imageId) {
        const usedValue = true;
        await imagesService.markImageUsed(characterData.imageId, usedValue);
    }

    // if movies provided, asociate with character
    if (movies) {
        await characterCreated.addMovies(movies);
    }

    return {
        id: characterCreated.id,
    };
}

const patchById = async (dataRec) => {
    // validate data
    if (dataRec.moviesAction && typeof dataRec.moviesAction === 'string') dataRec.moviesAction = dataRec.moviesAction.toLowerCase();
    const characterToUpdate = await validateCharPatch(dataRec);

    // splite movies from character
    const { movies, moviesAction } = characterToUpdate;
    delete characterToUpdate.movies;
    delete characterToUpdate.moviesAction;

    // if movies provided, check if exists
    if (movies) {
        const [ movieIdNotFound, result ] = await commonService.entitiesExist(models.Movie, movies);
        if (movieIdNotFound)
            throw new AppError(`Movie with id ${movieIdNotFound} not found. Character not updated`, 404);
    }

    // get character, check if exists and get imageId to another logic
    const characterBeforeUpdate = await models.Character.findByPk(characterToUpdate.id, { attributes: ['id','imageId'] });
    if (!characterBeforeUpdate) 
        throw new AppError(`Character with id ${characterToUpdate.id} not found. Character not updated`, 404);

    // if imageId provided, check if is valid
    if (characterToUpdate.imageId) {
        if (characterToUpdate.imageId === characterBeforeUpdate.imageId) {
            // character already using this image, not need to update, delete property
            delete characterToUpdate.imageId;
        } else {
            const [ imageNotFound, imageUsed] = await imagesService.imageBeingUsed(characterToUpdate.imageId);
            const [ imageNotFound2, imageMatchEntityType] = await imagesService.imageMatchEntityType(characterToUpdate.imageId, 'character');
            if (imageNotFound) 
                throw new AppError(`Image with id ${characterToUpdate.imageId} not found. Character not updated`, 404);
            if (imageUsed) 
                throw new AppError(`Image with id ${characterToUpdate.imageId} already being used by another entity. Character not updated`, 409);
            if (!imageMatchEntityType)
                throw new AppError(`Image with id ${characterToUpdate.imageId} is not a "character image". Character not updated`, 400);
        }
    }

    // define update object
    const updateCharacterData = apiHelper.deleteUndefinedProps({...characterToUpdate});
    delete updateCharacterData.id;

    // reject if update data is empty
    if (!movies && Object.keys(updateCharacterData).length === 0 && updateCharacterData.constructor === Object)
        throw new AppError('No data to update provided', 400);

    // update character
    const arrayRowsUpdated = await models.Character.update(updateCharacterData, { where: { id: characterToUpdate.id } });

    // if new imageId provided, mark is being used
    if (characterToUpdate.imageId) {
        await imagesService.markImageUsed(characterToUpdate.imageId);
    }
    // if imageId provided (new or null) and previous image was overwritten, delete previous image
    if ((characterToUpdate.imageId || characterToUpdate.imageId === null) && characterBeforeUpdate.imageId) {
        await imagesService.deleteImage(characterBeforeUpdate.imageId);
    }

    // if movies provided, asociate with character
    if (movies) {
        if (moviesAction === 'add') 
            await characterBeforeUpdate.addMovies(movies);
        else if (moviesAction === 'set')
            await characterBeforeUpdate.setMovies(movies);
        else if (moviesAction === 'remove')
            await characterBeforeUpdate.removeMovies(movies);
    }

    return null;
}

const deleteById = async (id) => {
    // validate id
    await validateId(id);

    // get character, check if exists and get imageId to another logic
    const characterBeforeDelete = await models.Character.findByPk(id, { attributes: ['id','imageId'] });
    if (!characterBeforeDelete) 
        throw new AppError(`Character with id ${id} not found. Character not deleted`, 404);
    
    // if character has image, delete
    if (characterBeforeDelete.imageId) {
        await imagesService.deleteImage(characterBeforeDelete.imageId);
    }

    // movies deleted automatically

    // delete character
    await characterBeforeDelete.destroy();

    return null;
}

module.exports = {
    getAll,   
    create,
    patchById,
    deleteById,
};

// functions
async function validateChar(data) {
    const schema = Joi.object({
        name: characterSchema.name.required(),
        age: characterSchema.age.allow(null),
        weight: characterSchema.weight.allow(null),
        story: characterSchema.story.allow(null),
        movies: [commonSchemas.id, commonSchemas.idArray],
        imageId: characterSchema.imageId.allow(null),
    });
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}
async function validateCharPatch(data) {
    const schema = Joi.object({
        id: characterSchema.id.required(),
        name: characterSchema.name,
        age: characterSchema.age.allow(null),
        weight: characterSchema.weight.allow(null),
        story: characterSchema.story.allow(null),
        imageId: characterSchema.imageId.allow(null),
        movies: [commonSchemas.id, commonSchemas.idArray],
        moviesAction: Joi.string().valid('add','set','remove'),
    })
        .with('movies', 'moviesAction');
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}
async function validateId(data) {
    const schema = characterSchema.id.required();
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}