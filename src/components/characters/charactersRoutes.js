const router = require('express').Router();
const charactersController = require('./charactersController');
const { apiHelper } = require('../../utils/helpers');
const auth = require('../auth/authMid');

const baseRout = '/characters';


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
            age=edad            (filter parameter)
            weight=peso         (filter parameter)
            movies=idMovie      (filter parameter)

        if "search" parameter provided, "filter" parameters will be ignored
        
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
    apiHelper.includeTryCatchController(charactersController.getAll));



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
        age: int,
        weight: float,
        story: string,
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
    apiHelper.includeTryCatchController(charactersController.create));



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
        age: int,
        weight: float,
        story: string,
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
    apiHelper.includeTryCatchController(charactersController.patchById));


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
    apiHelper.includeTryCatchController(charactersController.deleteById));

    
module.exports = {
    router,
    baseRout
};