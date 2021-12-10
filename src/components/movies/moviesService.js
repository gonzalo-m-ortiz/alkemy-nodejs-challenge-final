const Joi = require('joi');
const { Op } = require('sequelize');

const {models} = require('../../db');
const {AppError} = require('../../utils/errorsManagment');
const {validateHelper} = require('../../utils/helpers');
const {schemas:movieSchema} = require('./MovieModel');
const commonSchemas = require('../common/schemas');
const { apiHelper } = require('../../utils/helpers');

const imagesService = require('../images/imagesService');
const commonService = require('../common/commonService');

const getAll = async (dataRec) => {
    // parse query params to correct data type
    try {
        dataRec = apiHelper.parseObjectProperties(dataRec, ['genre', 'number']);
    } catch {
        throw new AppError(`Error parsing query params to correct dataType.`, 400);
    }

    // validate query params
    const { name, genre, order } = await validateGetAllParams(dataRec);

    // define "where" applicated to sql query
    const movieWhereClause = {}; // "main" where
    let orderClause = undefined; // "main" order
    let genreWhereClause = undefined; // association where, undefined to avoid inner join with {}
    if (name)
        movieWhereClause.title = { [Op.substring]: name, };
    else {
        if (genre)
            genreWhereClause = { id: genre };
    }
    if (order)
        orderClause = [ [ 'releaseDate', order ] ];
    
    // get movies list
    const movies = await models.Movie.findAll({
        attributes: ['id', 'title', 'releaseDate'],
        where: movieWhereClause,
        order: orderClause,
        include: [
            {
                model: models.Image, as: 'image',
                attributes: ['url'],
            },
            {
                model: models.Genre, as: 'genres',
                attributes: [],
                through: {
                    attributes: [],
                },
                where: genreWhereClause,
            },
        ]
    });
    return movies;
}

const getById = async (id) => {
    // validate id
    await validateId(id);

    // get movie
    const movie = await models.Movie.findByPk(id, {
        attributes: {
            exclude: ['imageId', 'createdAt', 'updatedAt'],
        },
        include: [
            {
                model: models.Image, as: 'image',
                attributes: ['id','url'],
            },
            {
                model: models.Character, as: 'characters',
                attributes: ['id','name'],
                through: {
                    attributes: [],
                },
                include: {
                    model: models.Image, as: 'image',
                    attributes: ['url'],
                },
            },
            {
                model: models.Genre, as: 'genres',
                attributes: ['id','name'],
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

    // check if movie exists
    if (!movie)
        throw new AppError(`Movie with id ${id} not found`, 404);

    return movie;
}

const create = async (dataRec) => {
    // validate data
    const movieData = await validateMovie(dataRec);

    // splite characters from movies
    const characters = movieData.characters;
    delete movieData.characters;
    // if characters provided, check if exists
    if (characters) {
        const [ characterIdNotFound, result ] = await commonService.entitiesExist(models.Character, characters);
        if (characterIdNotFound)
            throw new AppError(`Character with id ${characterIdNotFound} not found. Movie not created`, 404);
    }

    // splite genres from movies
    const genres = movieData.genres;
    delete movieData.genres;
    // if genres provided, check if exists
    if (genres) {
        const [ genreIdNotFound, result ] = await commonService.entitiesExist(models.Genre, genres);
        if (genreIdNotFound)
            throw new AppError(`Genre with id ${genreIdNotFound} not found. Movie not created`, 404);
    }

    // if imageId provided, check if not being used
    if (movieData.imageId) {
        const [ imageNotFound, imageUsed] = await imagesService.imageBeingUsed(movieData.imageId);
        const [ imageNotFound2, imageMatchEntityType] = await imagesService.imageMatchEntityType(movieData.imageId, 'movie');
        if (imageNotFound) 
            throw new AppError(`Image with id ${movieData.imageId} not found. Movie not created`, 404);
        if (imageUsed) 
            throw new AppError(`Image with id ${movieData.imageId} already being used. Movie not created`, 409);
        if (!imageMatchEntityType)
            throw new AppError(`Image with id ${movieData.imageId} is not a "movie image". Movie not created`, 400);
    }

    // create movie
    const movieCreated = await models.Movie.create(movieData);

    // if imageId provided, mark is being used
    if (movieData.imageId) {
        const usedValue = true;
        await imagesService.markImageUsed(movieData.imageId, usedValue);
    }

    // if characters provided, asociate with movie
    if (characters) {
        await movieCreated.addCharacters(characters);
    }
    // if genres provided, asociate with movie
    if (genres) {
        await movieCreated.addGenres(genres);
    }

    return {
        id: movieCreated.id,
    };
}

const patchById = async (dataRec) => {
    // validate data
    if (dataRec.charactersAction && typeof dataRec.charactersAction === 'string') 
        dataRec.charactersAction = dataRec.charactersAction.toLowerCase();
    if (dataRec.genresAction && typeof dataRec.genresAction === 'string') 
        dataRec.genresAction = dataRec.genresAction.toLowerCase();
    const movieToUpdate = await validateMoviePatch(dataRec);

    // splite characters from movie
    const { characters, charactersAction } = movieToUpdate;
    delete movieToUpdate.characters;
    delete movieToUpdate.charactersAction;
    // if characters provided, check if exists
    if (characters) {
        const [ characterIdNotFound, result ] = await commonService.entitiesExist(models.Character, characters);
        if (characterIdNotFound)
            throw new AppError(`Character with id ${movieIdNotFound} not found. Movie not updated`, 404);
    }

    // splite genres from movie
    const { genres, genresAction } = movieToUpdate;
    delete movieToUpdate.genres;
    delete movieToUpdate.genresAction;
    // if genres provided, check if exists
    if (genres) {
        const [ genreIdNotFound, result ] = await commonService.entitiesExist(models.Genre, genres);
        if (genreIdNotFound)
            throw new AppError(`Genre with id ${genreIdNotFound} not found. Movie not updated`, 404);
    }

    // get movie, check if exists and get imageId to another logic
    const movieBeforeUpdate = await models.Movie.findByPk(movieToUpdate.id, { attributes: ['id','imageId'] });
    if (!movieBeforeUpdate) 
        throw new AppError(`Movie with id ${movieToUpdate.id} not found. Movie not updated`, 404);

    // if imageId provided, check if is valid
    if (movieToUpdate.imageId) {
        if (movieToUpdate.imageId === movieBeforeUpdate.imageId) {
            // character already using this image, not need to update, delete property
            delete movieToUpdate.imageId;
        } else {
            const [ imageNotFound, imageUsed] = await imagesService.imageBeingUsed(movieToUpdate.imageId);
            const [ imageNotFound2, imageMatchEntityType] = await imagesService.imageMatchEntityType(movieToUpdate.imageId, 'movie');
            if (imageNotFound) 
                throw new AppError(`Image with id ${movieToUpdate.imageId} not found. Movie not updated`, 404);
            if (imageUsed) 
                throw new AppError(`Image with id ${movieToUpdate.imageId} already being used by another entity. Movie not updated`, 409);
            if (!imageMatchEntityType)
                throw new AppError(`Image with id ${movieToUpdate.imageId} is not a "movie image". Movie not updated`, 400);
        }
    }

    // define update object
    const updateMovieData = apiHelper.deleteUndefinedProps({...movieToUpdate});
    delete updateMovieData.id;

    // reject if update data is empty
    if (!characters && !genres && Object.keys(updateMovieData).length === 0 && updateMovieData.constructor === Object)
        throw new AppError('No data to update provided', 400);

    // update movie
    const arrayRowsUpdated = await models.Movie.update(updateMovieData, { where: { id: movieToUpdate.id } });

    // if new imageId provided, mark is being used
    if (movieToUpdate.imageId) {
        await imagesService.markImageUsed(movieToUpdate.imageId);
    }
    // if imageId provided (new or null) and previous image was overwritten, delete previous image
    if ((movieToUpdate.imageId || movieToUpdate.imageId === null) && movieBeforeUpdate.imageId) {
        await imagesService.deleteImage(movieBeforeUpdate.imageId);
    }

    // if characters provided, asociate with movie
    if (characters) {
        if (charactersAction === 'add') 
            await movieBeforeUpdate.addCharacters(characters);
        else if (charactersAction === 'set')
            await movieBeforeUpdate.setCharacters(characters);
        else if (charactersAction === 'remove')
            await movieBeforeUpdate.removeCharacters(characters);
    }
    // if genres provided, asociate with movie
    if (genres) {
        if (genresAction === 'add') 
            await movieBeforeUpdate.addGenres(genres);
        else if (genresAction === 'set')
            await movieBeforeUpdate.setGenres(genres);
        else if (genresAction === 'remove')
            await movieBeforeUpdate.removeGenres(genres);
    }

    return null;
}

const deleteById = async (id) => {
    // validate id
    await validateId(id);

    // get movie, check if exists and get imageId to another logic
    const movieBeforeDelete = await models.Movie.findByPk(id, { attributes: ['id','imageId'] });
    if (!movieBeforeDelete) 
        throw new AppError(`Movie with id ${id} not found. Movie not deleted`, 404);
    
    // if movie has image, delete
    if (movieBeforeDelete.imageId) {
        await imagesService.deleteImage(movieBeforeDelete.imageId);
    }

    // characters and genres associations deleted automatically

    // delete movie
    await movieBeforeDelete.destroy();

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
async function validateMovie(data) {
    const schema = Joi.object({
        title: movieSchema.title.required(),
        releaseDate: movieSchema.releaseDate.allow(null),
        rating: movieSchema.rating.allow(null),
        genres: [commonSchemas.id, commonSchemas.idArray],
        characters: [commonSchemas.id, commonSchemas.idArray],
        imageId: movieSchema.imageId.allow(null),
    });
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}
async function validateMoviePatch(data) {
    const schema = Joi.object({
        id: movieSchema.id.required(),
        title: movieSchema.title,
        releaseDate: movieSchema.releaseDate.allow(null),
        rating: movieSchema.rating.allow(null),
        imageId: movieSchema.imageId.allow(null),
        characters: [commonSchemas.id, commonSchemas.idArray],
        charactersAction: Joi.string().valid('add','set','remove'),
        genres: [commonSchemas.id, commonSchemas.idArray],
        genresAction: Joi.string().valid('add','set','remove'),
    })
        .with('characters', 'charactersAction')
        .with('genres', 'genresAction');
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}
async function validateId(data) {
    const schema = movieSchema.id.required();
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}
async function validateGetAllParams(data) {
    const schema = Joi.object({
        name: movieSchema.title,
        genre: commonSchemas.id,
        order: Joi.string().valid('ASC', 'DESC'),
    });
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}