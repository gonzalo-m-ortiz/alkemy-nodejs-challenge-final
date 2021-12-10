const router = require('express').Router();
const genresController = require('./genresController');
const { apiHelper } = require('../../utils/helpers');
const auth = require('../auth/authMid');

const baseRout = '/genres';


/*
    auth: (any)
        option 1: HEADER
            "x-access-token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 2: HEADER
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 3: BODY
            "token":"eyJhbGciOiJIUzI1NiIsIn..."

    query params:
        
    body { 
    }
    res {
        data: [
            {
                id: int,
                name: string, 
                image: null | {
                    url: string  (image url)
                }  
            },
        ]
    }
    status 200
*/
router.get('/', 
    auth.isAuthenticated,
    apiHelper.includeTryCatchController(genresController.getAll));


/*
    auth: (any)
        option 1: HEADER
            "x-access-token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 2: HEADER
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 3: BODY
            "token":"eyJhbGciOiJIUzI1NiIsIn..."

    body { 
    }
    res {
        data: {
            id: int,
            name: string,
            image: null | {
                id: string,
                url: string,
            },
            movies: [
                {
                    id: int,
                    title: string,
                    image: null | {
                        url: string
                    },
                },
            ]
        }
    }
    status 200
*/
router.get('/:id', 
    auth.isAuthenticated,
    apiHelper.includeTryCatchController(genresController.getById));


/*
    auth: (any)
        option 1: HEADER
            "x-access-token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 2: HEADER
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 3: BODY
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
    
    body {
        name: string, *
        movies: int[] | int, (movies Id),
        imageId: string, (uuidv4)
    }

    res {
        data: {
            id: int,
        }
    }
    status 201
*/
router.post('/',
    auth.isAuthenticated,
    apiHelper.onlyAccepts('application/json'),
    apiHelper.includeTryCatchController(genresController.create));


/*
    auth: (any)
        option 1: HEADER
            "x-access-token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 2: HEADER
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 3: BODY
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
    
    body { 
        name: string, 
        imageId: string, (uuidv4)
        movies: int[] | int, (movies Id) (if add this, moviesAction required)
        moviesAction: string, ('add' || 'set' || 'remove')
    }

    res {
        data: null
    }
    status 200
*/
router.patch('/:id', 
    auth.isAuthenticated,
    apiHelper.onlyAccepts('application/json'),
    apiHelper.includeTryCatchController(genresController.patchById));


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
    apiHelper.includeTryCatchController(genresController.deleteById));



module.exports = {
    router,
    baseRout
};