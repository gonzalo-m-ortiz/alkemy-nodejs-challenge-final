const { AppError } = require('../errorsManagment');

// Function that receive a function "handler" and return another function that execute handler asynchronous in a try-catch block
// Purpose: avoid try-catch blocks in controller and service layers, just throw errors and they will be catched and passed to the error handler
const includeTryCatchController = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
};

// Return object with 'data' 'message' 'type' to send in http responses
const resFormat = (data, message, type) => {
    return {
        type: type || 'success', // 'success' || 'error'
        message: message || 'Ok',
        data: data
    };
};

// Function that return a object "newObj" with the propiertes of an object "oldObj" selected in an string array "properties"
// "properties" can be an array of strings or just a string
// Purpose: extract the selected properties from request.body in controller layer, to send to service layer.
const extract = (oldObj, properties) => {
    const newObj = {};
    if (Array.isArray(properties)) {
        properties.forEach(property => {
            newObj[property] = oldObj[property];
        });
    } else if (typeof properties === 'string') {
        newObj = oldObj[properties];
    }

    return newObj;
};

// Function that receive a object and delete the properties with undefinded as value. Return that object
// e.g. const newObject = deleteUndefinedProps({...object});
// Purpose: delete undef props to send clean object to sequelizeModel.update()
// DUPLICATE OBJECT SENT TO NOT MODIFY ORIGINAL OBJECT 
const deleteUndefinedProps = (object) => {
    for (const property in object) {
        if (object[property] === undefined) {
            delete object[property];
        }
    }
    return object;
};

// Function that receive a object and a array of properties [ [propName, dataType], [propName2, dataType] ] or just [propName, dataType].
// Parse the selected properties of the object to de dataType indicated (assuming that actual prop is string | undefined | null).
// "dataType" accepted: 'boolean' 'number'
// Call this function in try-catch block defining 400 error
// Purpose: easy to parse values from "query params" to send to sequelize.
// DUPLICATE OBJECT SENT TO NOT MODIFY ORIGINAL OBJECT 
const parseObjectProperties = (object, arrayProps) => {
    if (typeof arrayProps[0] === 'string') {
        object[arrayProps[0]] = parseObjectPropertiesHelper(object[arrayProps[0]], arrayProps[1]);
        return object;
    }
    arrayProps.forEach(prop => {
        object[prop[0]] = parseObjectPropertiesHelper(object[prop[0]], prop[1]);
    });
    return object;
};
function parseObjectPropertiesHelper(value, type) {
    if (value === undefined || value === null) return value;
    if (type === 'number') return parseFloat(value);
    if (type === 'boolean') return (value.toLowerCase() === 'true');
    return value;
}


// Function that return middleware to reject requests that not match the "type" (first param)
const onlyAccepts = (type = 'application/json') => {
    const onlyAcceptsMiddleware = (req, res, next) => {
        try {
            if (!req.is(type)) {
                next(new AppError(`This Route only accepts content-type: ${type}`, 406));
            }
            next();
        } catch (error) {
            next(error);
        }
    };
    return onlyAcceptsMiddleware;
};

module.exports = {
    includeTryCatchController,
    resFormat,
    extract,
    deleteUndefinedProps,
    parseObjectProperties,
    onlyAccepts,
};