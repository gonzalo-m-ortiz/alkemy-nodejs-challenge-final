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


    
module.exports = {
    router,
    baseRout
};