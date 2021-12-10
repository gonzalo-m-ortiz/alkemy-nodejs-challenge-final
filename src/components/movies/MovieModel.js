const { DataTypes } = require('sequelize');
const Joi = require('joi');

module.exports = {
    definer: (sequelize) => {
        const Movie = sequelize.define('Movie', {
            // table columns
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            releaseDate: {
                type: DataTypes.STRING, // YYYY-MM-DD
            },
            rating: {
                type: DataTypes.FLOAT,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            /* Created in associations
            imageId: {
                type: DataTypes.UUID,
            }, */
        }, {
            // table options
            tableName: 'Movies',
            timestamps: true,
        });
    
        Movie.associate = (models) => {
            // associate here
            models.Movie.belongsTo(models.Image, {
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

            models.Movie.belongsToMany(models.Character, {
                through: models.CharMovieMap,
                foreignKey: 'movieId',
                as: 'characters',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE', 
            });

            models.Movie.belongsToMany(models.Genre, {
                through: models.GenreMovieMap,
                foreignKey: 'movieId',
                as: 'genres',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE', 
            });
        };
    
        return Movie;
    },

    schemas: {
        id: Joi.number().integer().min(1).max(2147483647),
        title: Joi.string().min(1).max(150),
        releaseDate: Joi.string().pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, 'yyyy-mm-dd'),
        rating: Joi.number().min(1).max(5),
        imageId: Joi.string().guid({ version: 'uuidv4' }),
    }
};