const router = require('express').Router();
const moviesController = require('./moviesController');
const { apiHelper } = require('../../utils/helpers');
const auth = require('../auth/authMid');

const baseRout = '/movies';


/*
    auth: (any)
        option 1: HEADER
            "x-access-token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 2: HEADER
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 3: BODY
            "token":"eyJhbGciOiJIUzI1NiIsIn..."

    query params:
        option 1:
            -
        option 2:
            name=nombre         (search parameter, contains)
        option 3:
            genre=IdGenero      (filter parameter)
        option -:
            order=ASC | DESC    (order parameter)

        "order" parameter can be combined with any option
        if "search" parameter provided, "filter" parameters will be ignored
        
    body { 
    }
    res {
        data: [
            {
                id: int,
                title: string,
                releaseDate: string, (YYYY-MM-DD)
                image: null | {
                    url: string  (image url)
                } ,
            },
        ]
    }
    status 200
*/
router.get('/',
    auth.isAuthenticated,
    apiHelper.includeTryCatchController(moviesController.getAll));


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
            title: string,
            releaseDate: string | null, (YYYY-MM-DD)
            rating: float | null,
            image: null | {
                id: string,
                url: string,
            },
            characters: [
                {
                    id: int,
                    name: string,
                    image: null | {
                        url: string
                    },
                },
            ],
            genres: [
                {
                    id: int,
                    name: string,
                    image: null | {
                        url: string
                    },
                },
            ],
        }
    }
    status 200
*/
router.get('/:id',
    auth.isAuthenticated,
    apiHelper.includeTryCatchController(moviesController.getById));


/*
    auth: (any)
        option 1: HEADER
            "x-access-token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 2: HEADER
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 3: BODY
            "token":"eyJhbGciOiJIUzI1NiIsIn..."

    body {
        title: string, *
        releaseDate: string, (YYYY-MM-DD)
        rating: float,
        characters: int[] | int, (characters Id),
        genres: int[] | int, (genres Id),
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
    apiHelper.includeTryCatchController(moviesController.create));


/*
    auth: (any)
        option 1: HEADER
            "x-access-token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 2: HEADER
            "token":"eyJhbGciOiJIUzI1NiIsIn..."
        option 3: BODY
            "token":"eyJhbGciOiJIUzI1NiIsIn..."

    body { 
        title: string, 
        releaseDate: string, (YYYY-MM-DD)
        rating: float,
        imageId: string, (uuidv4)
        characters: int[] | int, (characters Id) (if add this, charactersAction required)
        charactersAction: string, ('add' || 'set' || 'remove') 
        genres: int[] | int, (genres Id) (if add this, genresAction required)
        genresAction: string, ('add' || 'set' || 'remove')
    }

    res {
        data: null
    }
    status 200
*/
router.patch('/:id', 
    auth.isAuthenticated,
    apiHelper.onlyAccepts('application/json'),
    apiHelper.includeTryCatchController(moviesController.patchById));


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
    apiHelper.includeTryCatchController(moviesController.deleteById));



module.exports = {
    router,
    baseRout
};