const { DataTypes } = require('sequelize');
const Joi = require('joi');

module.exports = {
    definer: (sequelize) => {
        const Genre = sequelize.define('Genre', {
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
            /* Created in associations
            imageId: {
                type: DataTypes.UUID,
            }, */
        }, {
            // table options
            tableName: 'Genres',
            timestamps: true,
        });
    
        Genre.associate = (models) => {
            // associate here
            models.Genre.belongsTo(models.Image, {
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

            models.Genre.belongsToMany(models.Movie, {
                through: models.GenreMovieMap,
                foreignKey: 'genreId',
                as: 'movies',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE', 
            });
        };
    
        return Genre;
    },

    schemas: {
        id: Joi.number().integer().min(1).max(2147483647),
        name: Joi.string().min(1).max(150),
        imageId: Joi.string().guid({ version: 'uuidv4' }),
    }
};