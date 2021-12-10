const { DataTypes } = require('sequelize');
const Joi = require('joi');

module.exports = {
    definer: (sequelize) => {
        const Character = sequelize.define('Character', {
            // table columns
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            age: {
                type: DataTypes.INTEGER,
            },
            weight: {
                type: DataTypes.FLOAT,
            },
            story: {
                type: DataTypes.TEXT,
            },
            /* Created in associations
            imageId: {
                type: DataTypes.UUID,
            }, */
        }, {
            // table options
            tableName: 'Characters',
            timestamps: true,
        });
    
        Character.associate = (models) => {
            // associate here
            models.Character.belongsTo(models.Image, {
                foreignKey: {
                    name: 'imageId',
                    type: DataTypes.UUID,
                    allowNull: true,
                    unique:true,
                },
                as: 'image',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE', 
            });

            models.Character.belongsToMany(models.Movie, {
                through: models.CharMovieMap,
                foreignKey: 'charId',
                as: 'movies',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',    
            });
        };
    
        return Character;
    },

    schemas: {
        id: Joi.number().integer().min(1).max(2147483647),
        name: Joi.string().min(1).max(100),
        age: Joi.number().integer().min(0),
        weight: Joi.number().min(0),
        story: Joi.string(),
        imageId: Joi.string().guid({ version: 'uuidv4' }),
    }
};