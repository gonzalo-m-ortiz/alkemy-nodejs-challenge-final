const jsonWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const config = require('../../config');
const {models} = require('../../db');
const {AppError, errorHandler} = require('../../utils/errorsManagment');
const {validateHelper} = require('../../utils/helpers');
const {schemas:userSchemas} = require('../users/UserModel');

const register = async (dataRec) => {
    const {email, password} = await validateEmailPassword(dataRec);

    //check if user exists
    const oldUser = await models.User.findOne({ where: { email }, attributes: ['id']});
    if (oldUser) throw new AppError('User already exist. Login or Choose another email', 409);

    //encrypt password
    const hashedPassword = bcrypt.hashSync(password, config.auth.saltRounds);

    //create user
    const user = await models.User.create({email, password:hashedPassword});

    const tokenPayload = {
        id: user.id,
        email: user.email,
    };

    //create token
    const token = createToken(tokenPayload);

    return {
        id:user.id,
        email:user.email,
        token,
    };
}

const login = async (dataRec) => {
    const {email, password} = await validateEmailPassword(dataRec);

    //check credentials
    const user = await models.User.findOne({ where: { email } });
    if (!user) throw new AppError('Email and/or Password incorrect', 401);
    // compare plain password vs dbHashedPassword
    if (!bcrypt.compareSync(password, user.password)) throw new AppError('Email and/or Password incorrect', 401);

    const tokenPayload = {
        id: user.id,
        email: user.email,
    };
    //create token
    const token = createToken(tokenPayload);

    return {
        id: user.id,
        email: user.email,
        token,
    };
}

const verifyToken = (token) => {
    return jsonWT.verify(token, config.auth.tokenKey, config.auth.tokenOptions);
}

module.exports = {
    register,
    login,
    verifyToken,
};

// functions

function createToken(payload) {
    return jsonWT.sign(payload, config.auth.tokenKey, config.auth.tokenOptions);
}

async function validateEmailPassword(data) {
    const schema = Joi.object({
        email: (userSchemas.email).required(),
        password: (userSchemas.password).required(),
    });
    const dataValidated = await validateHelper.validateJoi(data, schema);
    return dataValidated;
}