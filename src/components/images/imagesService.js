const Joi = require('joi');
const fs = require('fs').promises;

const config = require('../../config');
const {models} = require('../../db');
const {AppError, errorHandler} = require('../../utils/errorsManagment');
const {validateHelper} = require('../../utils/helpers');
const {schemas:imageSchema} = require('./ImageModel');
const commonSchemas = require('../common/schemas');


// METHODS USED BY ANOTHER COMPONENTS

// Receive int (imageId)
// Returns [err, data]
//      err = null | true --> image doesn't exist
//      data = null | true --> image deleted
const deleteImage = async (id) => {
    // validate in function that called this

    // get instance, check if image exists + get localPath to delete file
    const imageBeforeDelete = await models.Image.findByPk(id, { attributes: ['id','localFolder','fileName'] });
    if (!imageBeforeDelete)
        return [true, null]; // image doesn't exist
    
    // save localPath
    const localPath = `${imageBeforeDelete.localFolder}/${imageBeforeDelete.fileName}`; 
    
    // delete image in database
    await imageBeforeDelete.destroy();

    // delete image file
    try { 
        await fs.unlink(`${__dirname}/../../../public${localPath}`);
    } catch {
        await errorHandler.handleMinorError(new AppError(`File ${localPath} not deleted`, 500));
    }
    
    return [null, true];  // all ok
}

// Receive int (imageId)
// Returns [err, data]
//      err = null | true --> image doesn't exist
//      data = null | true/false --> image.used
const imageBeingUsed = async (id) => {
    // validate in function that called this

    // get image "used"
    const image = await models.Image.findByPk(id, { attributes: ['used'] });

    // check image status
    if (!image) return [true, null]; // image doesn't exist  

    return [null, image.used]; // all ok
}

// Receive int (imageId) AND string|null entityType 
// Returns [err, data]
//      err = null | true --> image doesn't exist
//      data = null | true/false --> image matches the entity type? true : false
const imageMatchEntityType = async (id, entityType = null) => {
    // validate in function that called this

    // get image
    const image = await models.Image.findByPk(id, { attributes: ['entityType'] });

    // check image status
    if (!image) return [true, null]; // image doesn't exist  

    return [null, entityType === image.entityType]; // all ok
}

// Receive int (imageId)
// Returns [err, data]
//      err = null | true --> image doesn't exist
//      data = null | true --> image updated
const markImageUsed = async (id, usedValue = true) => {
    // validate in function that called this

    // update image
    const arrayResult = await models.Image.update({ used: usedValue }, { where: { id } });

    // return result
    if (arrayResult[0] === 0) return [true, null]; // image doesn't exist  

    return [null, true]; // all ok
}


// METHODS USED BY CONTROLLER

const create = async (dataRec) => {
    // validate
    const { localFolder, fileName, entityType } = dataRec;
    if (!localFolder || !fileName)
        throw new AppError('No image upload.', 400);
    
    try { // entityType filled in the application according to endpoint
        await validateEntityType(entityType);
    } catch (err) {
        throw new AppError('Create Image: Invalid Entity Type', 500);
    }

    // make imageUrl
    const imageUrl = `${config.app.staticAddress}${localFolder}/${fileName}`; // 'http://localhost:3000/static/characters/images/file.jpg'

    // save imageUrl in db
    const imageCreated = await models.Image.create({ url: imageUrl, localFolder, fileName, entityType });

    return {
        id: imageCreated.id,
        url: imageCreated.url,
    };
}

const putById = async (dataRec) => {
    const { localFolder, fileName, id } = dataRec;

    // validate
    await validateId(id);
    if (!localFolder || !fileName)
        throw new AppError('No image upload.', 400);

    // make newImageUrl
    const newImageUrl = `${config.app.staticAddress}${localFolder}/${fileName}`; // 'http://localhost:3000/static/characters/images/file.jpg'

    // get image, check if exists and get path to delete previous file
    const imageToUpdate = await models.Image.findByPk(id, { attributes: ['id','localFolder','fileName'] }); 
    if (!imageToUpdate) // image doesn't exist
        throw new AppError(`Image with id ${id} not found`, 404);
    
    // save oldLocalPath
    const oldLocalPath = `${imageToUpdate.localFolder}/${imageToUpdate.fileName}`;

    // save newImage in db
    await imageToUpdate.update({ url: newImageUrl, localFolder, fileName });

    // delete old file
    try { 
        await fs.unlink(`${__dirname}/../../../public${oldLocalPath}`);
    } catch {
        await errorHandler.handleMinorError(new AppError(`File ${oldLocalPath} not deleted`, 500));
    }

    return {
        url: newImageUrl,
    };
}

const deleteById = async (id) => {
    // validate id
    await validateId(id);

    // delete image
    const [imageNotFound, imageDeleted] = await deleteImage(id);

    if (imageNotFound) 
        throw new AppError(`Image with id ${id} not found`, 404);

    return null;
}

const getLocalFolder = async (id) => {
    // validate id
    await validateId(id);

    // get image
    const image = await models.Image.findByPk(id, { attributes: ['localFolder'] });

    // check if image exists
    if (!image) 
        throw new AppError(`Image with id ${id} not found`, 404);

    // return localFolder
    return image.localFolder;
}



module.exports = {
    create,
    deleteById,
    deleteImage,
    getLocalFolder,
    imageBeingUsed,
    imageMatchEntityType,
    markImageUsed,
    putById,
};

// functions
async function validateId(data) {
    const schema = imageSchema.id.required();
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}

async function validateEntityType(data) {
    const schema = imageSchema.entityType.required();
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}