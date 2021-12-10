const router = require('express').Router();
const imagesController = require('./imagesController');
const { apiHelper, multerHelper } = require('../../utils/helpers');
const auth = require('../auth/authMid');

const baseRout = '/images';


/*
    auth: (any)
        option 1: HEADER
            "x-access-token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 2: HEADER
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 3: BODY
            "token":"eyJhbGciOiJIUzI1NiIsIn..."

    (multipart/form-data)
    key     |     value     |    type
    image         *.jpg         file (jpeg,jpg,png,gif)

    (json)
    res {
        data: {
            id: string, (uuidv4)
            url: string, (image url)
        }
    }
    status 201
*/

router.post('/characters',
    auth.isAuthenticated,
    apiHelper.onlyAccepts('multipart/form-data'),
    multerHelper.getSingleImage('image', '/characters/images'),  // 'image' = key value of form data
    setEntityTypeToBody('character'),
    apiHelper.includeTryCatchController(imagesController.create));

router.post('/movies',
    auth.isAuthenticated,
    apiHelper.onlyAccepts('multipart/form-data'),
    multerHelper.getSingleImage('image', '/movies/images'),  // 'image' = key value of form data
    setEntityTypeToBody('movie'),
    apiHelper.includeTryCatchController(imagesController.create));

router.post('/genres',
    auth.isAuthenticated,
    apiHelper.onlyAccepts('multipart/form-data'),
    multerHelper.getSingleImage('image', '/genres/images'),  // 'image' = key value of form data
    setEntityTypeToBody('genre'),
    apiHelper.includeTryCatchController(imagesController.create));


/*
    auth: (any)
        option 1: HEADER
            "x-access-token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 2: HEADER
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 3: BODY
            "token":"eyJhbGciOiJIUzI1NiIsIn..."

    (multipart/form-data)
    key     |     value     |    type
    image         *.jpg         file (jpeg,jpg,png,gif)

    (json)
    res {
        data: {
            url: string, (image url)
        }
    }
    status 200
*/
router.put('/:id',
    auth.isAuthenticated,
    apiHelper.onlyAccepts('multipart/form-data'),
    findAndSetImageFolderToParams,
    multerHelper.getSingleImage('image'), // 'image' = key value of form data
    apiHelper.includeTryCatchController(imagesController.putById));


/*
    auth: (any)
        option 1: HEADER
            "x-access-token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 2: HEADER
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 3: BODY
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
            
    body { } 

    res {
        data: null
    }
    status 200
*/
router.delete('/:id', 
    auth.isAuthenticated,
    apiHelper.includeTryCatchController(imagesController.deleteById));


module.exports = {
    router,
    baseRout
};

async function findAndSetImageFolderToParams(req, res, next) {
    try {
        // get id from params
        const { id } = req.params;
        
        // get localFolder of image
        const localFolder = await imagesController.getLocalFolder(id);

        // set localFolder to params to be used by multerHelper.js
        req.params.localFolder = localFolder;

        next();
    } catch (err) {
        next(err);
    }
}

function setEntityTypeToBody(entityType = null) {
    const setEntityTypeToBodyMiddleware = (req, res, next) => {
        try {
            if (req.body) {
                req.body.entityType = entityType;
            } else {
                req.body = { entityType };
            }
            next();
        } catch (error) {
            next(error);
        }
    }
    return setEntityTypeToBodyMiddleware;
}