const { Sequelize } = require('sequelize');
const config = require('../config');
const { logger } = require('../utils/loggers');

const dbOptions = {
    logging: msg => logger.debug(msg),
    schema: config.schema,
};

const sequelize = new Sequelize(config.db.connString, dbOptions);

// req models
const modelsDefiners = [
    //require('../components/component/componentModel').definer,
];

// creating models
const models = [];
modelsDefiners.forEach(modelDefiner => {
    models.push(modelDefiner(sequelize));
});

// associating models
models.forEach(model => {
    if (model.associate) {
        model.associate(sequelize.models);
    }
});


if (config.env === 'dev') {
    // This creates the table, dropping it first if it already existed
    (async () => {
        await sequelize.sync({force:true});
    })();
} else {
    //checks the current state of the table in the database, and then performs the necessary changes in the table to make it match the model.
    (async () => {
        await sequelize.sync({alter:true});
    })();
}



module.exports = sequelize;