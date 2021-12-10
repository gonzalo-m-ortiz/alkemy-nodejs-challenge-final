const Joi = require('joi');
const { Op } = require('sequelize');

const {models} = require('../../db');
const {AppError} = require('../../utils/errorsManagment');
const {validateHelper} = require('../../utils/helpers');
const {schemas:genreModel} = require('./GenreModel');
const commonSchemas = require('../common/schemas');
const { apiHelper } = require('../../utils/helpers');

const imagesService = require('../images/imagesService');
const commonService = require('../common/commonService');

const getAll = async () => {
    // get genres list
    const genres = await models.Genre.findAll({
        attributes: ['id','name'],
        include: [
            {
                model: models.Image, as: 'image',
                attributes: ['url'],
            },
        ]
    });
    return genres;
}

const getById = async (id) => {
    // validate id
    await validateId(id);

    // get genre
    const genre = await models.Genre.findByPk(id, {
        attributes: {
            exclude: ['imageId', 'createdAt', 'updatedAt'],
        },
        include: [
            {
                model: models.Image, as: 'image',
                attributes: ['id','url'],
            },
            {
                model: models.Movie, as: 'movies',
                attributes: ['id','title'],
                through: {
                    attributes: [],
                },
                include: {
                    model: models.Image, as: 'image',
                    attributes: ['url'],
                },
            },
        ],
    });

    // check if genre exists
    if (!genre)
        throw new AppError(`Genre with id ${id} not found`, 404);

    return genre;
}

const create = async (dataRec) => {
    // validate data
    const genreData = await validateGenre(dataRec);

    // splite movies from genre
    const movies = genreData.movies;
    delete genreData.movies;

    // if movies provided, check if exists
    if (movies) {
        const [ movieIdNotFound, result ] = await commonService.entitiesExist(models.Movie, movies);
        if (movieIdNotFound)
            throw new AppError(`Movie with id ${movieIdNotFound} not found. Genre not created`, 404);
    }

    // if imageId provided, check if not being used
    if (genreData.imageId) {
        const [ imageNotFound, imageUsed] = await imagesService.imageBeingUsed(genreData.imageId);
        const [ imageNotFound2, imageMatchEntityType] = await imagesService.imageMatchEntityType(genreData.imageId, 'genre');
        if (imageNotFound) 
            throw new AppError(`Image with id ${genreData.imageId} not found. Genre not created`, 404);
        if (imageUsed) 
            throw new AppError(`Image with id ${genreData.imageId} already being used. Genre not created`, 409);
        if (!imageMatchEntityType)
            throw new AppError(`Image with id ${genreData.imageId} is not a "genre image". Genre not created`, 400);
    }

    // create genre
    const genreCreated = await models.Genre.create(genreData);

    // if imageId provided, mark is being used
    if (genreData.imageId) {
        const usedValue = true;
        await imagesService.markImageUsed(genreData.imageId, usedValue);
    }

    // if movies provided, asociate with genre
    if (movies) {
        await genreCreated.addMovies(movies);
    }

    return {
        id: genreCreated.id,
    };
}

const patchById = async (dataRec) => {
    // validate data
    if (dataRec.moviesAction && typeof dataRec.moviesAction === 'string') dataRec.moviesAction = dataRec.moviesAction.toLowerCase();
    const genreToUpdate = await validateGenrePatch(dataRec);

    // splite movies from genre
    const { movies, moviesAction } = genreToUpdate;
    delete genreToUpdate.movies;
    delete genreToUpdate.moviesAction;

    // if movies provided, check if exists
    if (movies) {
        const [ movieIdNotFound, result ] = await commonService.entitiesExist(models.Movie, movies);
        if (movieIdNotFound)
            throw new AppError(`Movie with id ${movieIdNotFound} not found. Genre not updated`, 404);
    }

    // get genre, check if exists and get imageId to another logic
    const genreBeforeUpdate = await models.Genre.findByPk(genreToUpdate.id, { attributes: ['id','imageId'] });
    if (!genreBeforeUpdate) 
        throw new AppError(`Genre with id ${genreToUpdate.id} not found. Genre not updated`, 404);

    // if imageId provided, check if is valid
    if (genreToUpdate.imageId) {
        if (genreToUpdate.imageId === genreBeforeUpdate.imageId) {
            // genre already using this image, not need to update, delete property
            delete genreToUpdate.imageId;
        } else {
            const [ imageNotFound, imageUsed] = await imagesService.imageBeingUsed(genreToUpdate.imageId);
            const [ imageNotFound2, imageMatchEntityType] = await imagesService.imageMatchEntityType(genreToUpdate.imageId, 'genre');
            if (imageNotFound) 
                throw new AppError(`Image with id ${genreToUpdate.imageId} not found. Genre not updated`, 404);
            if (imageUsed) 
                throw new AppError(`Image with id ${genreToUpdate.imageId} already being used by another entity. Genre not updated`, 409);
            if (!imageMatchEntityType)
                throw new AppError(`Image with id ${genreToUpdate.imageId} is not a "genre image". Genre not updated`, 400);
        }
    }

    // define update object
    const updateGenreData = apiHelper.deleteUndefinedProps({...genreToUpdate});
    delete updateGenreData.id;

    // reject if update data is empty
    if (!movies && Object.keys(updateGenreData).length === 0 && updateGenreData.constructor === Object)
        throw new AppError('No data to update provided', 400);

    // update genre
    const arrayRowsUpdated = await models.Genre.update(updateGenreData, { where: { id: genreToUpdate.id } });

    // if new imageId provided, mark is being used
    if (genreToUpdate.imageId) {
        await imagesService.markImageUsed(genreToUpdate.imageId);
    }
    // if imageId provided (new or null) and previous image was overwritten, delete previous image
    if ((genreToUpdate.imageId || genreToUpdate.imageId === null) && genreBeforeUpdate.imageId) {
        await imagesService.deleteImage(genreBeforeUpdate.imageId);
    }

    // if movies provided, asociate with genre
    if (movies) {
        if (moviesAction === 'add') 
            await genreBeforeUpdate.addMovies(movies);
        else if (moviesAction === 'set')
            await genreBeforeUpdate.setMovies(movies);
        else if (moviesAction === 'remove')
            await genreBeforeUpdate.removeMovies(movies);
    }

    return null;
}

const deleteById = async (id) => {
    // validate id
    await validateId(id);

    // get genre, check if exists and get imageId to another logic
    const genreBeforeDelete = await models.Genre.findByPk(id, { attributes: ['id','imageId'] });
    if (!genreBeforeDelete) 
        throw new AppError(`Genre with id ${id} not found. Genre not deleted`, 404);
    
    // if genre has image, delete
    if (genreBeforeDelete.imageId) {
        await imagesService.deleteImage(genreBeforeDelete.imageId);
    }

    // movies deleted automatically

    // delete genre
    await genreBeforeDelete.destroy();

    return null;
}

module.exports = {
    getAll,
    getById,
    create,
    patchById,
    deleteById,
};

// functions
async function validateGenre(data) {
    const schema = Joi.object({
        name: genreModel.name.required(),
        movies: [commonSchemas.id, commonSchemas.idArray],
        imageId: genreModel.imageId.allow(null),
    });
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}
async function validateGenrePatch(data) {
    const schema = Joi.object({
        id: genreModel.id.required(),
        name: genreModel.name,
        imageId: genreModel.imageId.allow(null),
        movies: [commonSchemas.id, commonSchemas.idArray],
        moviesAction: Joi.string().valid('add','set','remove'),
    })
        .with('movies', 'moviesAction');
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}
async function validateId(data) {
    const schema = genreModel.id.required();
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}