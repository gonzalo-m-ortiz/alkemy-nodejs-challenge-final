const { DataTypes } = require('sequelize');
const Joi = require('joi');

module.exports = {
    definer: (sequelize) => {
        const Image = sequelize.define('Image', {
            // table columns
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            localFolder: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fileName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            used: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            entityType: {
                type: DataTypes.STRING,
            },
        }, {
            // table options
            tableName: 'Images',
            timestamps: true,
        });
    
        Image.associate = (models) => {
            // associate here
            models.Image.hasOne(models.Character, {
                foreignKey: {
                    name: 'imageId',
                    type: DataTypes.UUID,
                    allowNull: true,
                    unique:true,
                },
                as: 'character',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE', 
            });
            models.Image.hasOne(models.Movie, {
                foreignKey: {
                    name: 'imageId',
                    type: DataTypes.UUID,
                    allowNull: true,
                    unique:true,
                },
                as: 'movie',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE', 
            });
            models.Image.hasOne(models.Genre, {
                foreignKey: {
                    name: 'imageId',
                    type: DataTypes.UUID,
                    allowNull: true,
                    unique:true,
                },
                as: 'genre',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE', 
            });
        };
    
        return Image;
    },

    schemas: {
        id: Joi.string().guid({ version: 'uuidv4' }),
        url: Joi.string().min(1),
        localFolder: Joi.string().min(1),
        fileName: Joi.string().min(1),
        used: Joi.boolean(),
        entityType: Joi.string().valid('character','movie','genre'),
    }
};