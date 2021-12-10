const { AppError } = require('../errorsManagment');

// async function validate data with schema in try catch block returning predefined error
// data must be an object
// return object with data validated
const validateJoi = async (data, schema) => {
    try {
        const value = await schema.validateAsync(data);
        return value;
    } catch(err) {
        throw new AppError('Validate Error. Detail: ' +  err.message, 400);
    }
};

module.exports = {
    validateJoi,
};