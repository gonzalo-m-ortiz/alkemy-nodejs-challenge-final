const { DataTypes } = require('sequelize');

module.exports = {
    definer: (sequelize) => {
        const GenreMovieMap = sequelize.define('GenreMovieMap', {
            // table columns
            
        }, {
            // table options
            tableName: 'GenresMoviesMap',
            timestamps: false,
        });
    
        GenreMovieMap.associate = (models) => {
            // associate here
        };
    
        return GenreMovieMap;
    },
};