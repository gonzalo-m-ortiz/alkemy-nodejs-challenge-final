const { DataTypes } = require('sequelize');

module.exports = {
    definer: (sequelize) => {
        const CharMovieMap = sequelize.define('CharMovieMap', {
            // table columns
            
        }, {
            // table options
            tableName: 'CharsMoviesMap',
            timestamps: false,
        });
    
        CharMovieMap.associate = (models) => {
            // associate here
        };
    
        return CharMovieMap;
    },
};