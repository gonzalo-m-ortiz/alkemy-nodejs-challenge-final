const router = require('express').Router();
const authController = require('./authController');
const { apiHelper } = require('../../utils/helpers');

const baseRout = '/auth';

/*
    body { 
        email:string,
        password:string
    }
    res {
        data: {
            id:int,
            email:int,
            token:string
        }
    }
    status 201
*/
router.post('/register', 
    apiHelper.onlyAccepts('application/json'),
    apiHelper.includeTryCatchController(authController.register));


/*
    body { 
        email:string,
        password:string
    }
    res {
        data: {
            id:int,
            email:int,
            token:string
        }
    }
    status 200
*/
router.post('/login', 
    apiHelper.onlyAccepts('application/json'),
    apiHelper.includeTryCatchController(authController.login));


module.exports = {
    router,
    baseRout
};