const { DataTypes } = require('sequelize');
const Joi = require('joi');

module.exports = {
    definer: (sequelize) => {
        const User = sequelize.define('User', {
            // table columns
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique:true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            // table options
            tableName: 'Users',
            timestamps: true,
        });
    
        User.associate = (models) => {
            // associate here      
        };
    
        return User;
    },

    schemas: {
        id: Joi.number().integer().min(1).max(2147483647),
        email: Joi.string().email(),
        password: Joi.string().min(3).max(100),
    }
};