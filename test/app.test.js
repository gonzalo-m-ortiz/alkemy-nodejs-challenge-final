// using mocha + chai
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs');

chai.use(chaiHttp);

// SERVER
const config = require('../src/config');
const urlServer = `http://localhost:${config.app.port}`;

/*  @Clarification
    I know that tests should be independent of each other, creating new data per test.
    tests run sequentially
*/

const bEP = config.app.apiRout; // base EndPoint '/api'
// --- ROUTES ---
const authEP = {
    register: bEP + '/auth/register',
    login: bEP + '/auth/login',
};
const imagesEP = {
    putById: bEP + '/images/',
    deleteById: bEP + '/images/',
    createImageCharacter: bEP + '/images/characters',
    createImageMovie: bEP + '/images/movies',
    createImageGenre: bEP + '/images/genres',
};
const charactersEP = {
    create: bEP + '/characters',
    patchById: bEP + '/characters/',
    deleteById: bEP + '/characters/',
    getById: bEP + '/characters/',
    getAll: bEP + '/characters',
};
const moviesEP = {
    create: bEP + '/movies',
    patchById: bEP + '/movies/',
    deleteById: bEP + '/movies/',
    getById: bEP + '/movies/',
    getAll: bEP + '/movies',
};
const genresEP = {
    create: bEP + '/genres',
    patchById: bEP + '/genres/',
    deleteById: bEP + '/genres/',
    getById: bEP + '/genres/',
    getAll: bEP + '/genres',
};
// --- END ROUTES ---

// DATA
const sampleFilesPath = `${__dirname}/sample-files/`;
const dayAsString = '2021-11-26';
let userTest = { }; // mod in register test
let validToken = '';
let movieImageCreated = {};
let imageToDelete = {};
let genreCreated = {};
let movieCreated = {};
// ----


describe('Auth endpoint', () => {

    describe(`Register new predef user. "${authEP.register}"`, () => {

        it('missing data. Expect 400 bad request', async () => {
            // Arrange
            const userCreate = {

            };
    
            // Act  
            const res = await chai.request(urlServer)
                .post(authEP.register)
                .send(userCreate);
    
            // Assert
            expectBad(res, 400);
        });

        it('correct data. Expect 201 and userData: {id,email,token}', async () => {
            // Arrange
            const userCreate = {
                // email has unique=true. Random name for multiple test
                email:'userTest' + (Math.random() + 1).toString(36).substring(2) + '@example.com', 
                password:'1234',
            };
    
            // Act  
            const res = await chai.request(urlServer)
                .post(authEP.register)
                .send(userCreate);

            // Assert
            expectGood(res, 201);
            const { id, email, token } = res.body.data;
            expect(id).to.be.above(0);
            expect(email).to.equal(userCreate.email);
            expect(token).to.be.a('string');
            
            // Save data for other tests
            userTest = {
                id,
                email,
                password: userCreate.password,
                token
            };
            validToken = token;
        });
    });


    describe(`Login predef user. "${authEP.login}"`, () => {

        it('missing data. Expect 400 bad request', async () => {
            // Arrange
            const userValidate = { };

            // Act  
            const res = await chai.request(urlServer)
                .post(authEP.login)
                .send(userValidate);

            // Assert
            expectBad(res, 400);
        });

        it('good request but not existing user, not existing password. Expect 401 unauthorized', async () => {
            // Arrange
            const userValidate = {
                email: 'rareName15fsacajh1551@example.com',
                password: 'rarePassword18571hbabcajkr1'
            };

            // Act  
            const res = await chai.request(urlServer)
                .post(authEP.login)
                .send(userValidate);

            // Assert
            expectBad(res, 401);
        });

        it('good request existing user, invalid password. Expect 401 unauthorized', async () => {
            // Arrange
            const userValidate = {
                email: userTest.email,
                password: 'rarePassword18571hbabcajkr1'
            };

            // Act  
            const res = await chai.request(urlServer)
                .post(authEP.login)
                .send(userValidate);

            // Assert
            expectBad(res, 401);
        });

        it('good request existing password, invalid user. Expect 401 unauthorized', async () => {
            // Arrange
            const userValidate = {
                email: 'rareName15fsacajh1551@example.com',
                password: userTest.password
            };

            // Act  
            const res = await chai.request(urlServer)
                .post(authEP.login)
                .send(userValidate);

            // Assert
            expectBad(res, 401);
        });

        it('correct data. Expect 200 and userData: {id,email,token}', async () => {
            // Arrange
            const userValidate = {
                email: userTest.email,
                password: userTest.password,
            };

            // Act  
            const res = await chai.request(urlServer)
                .post(authEP.login)
                .send(userValidate);

            // Assert
            expectGood(res, 200);
            const { id, email, token } = res.body.data;
            expect(id).to.equal(userTest.id);
            expect(email).to.equal(userTest.email);
            expect(token).to.be.a('string');
        });
    });

});



describe('Testing protected route.', () => {

    it('accesing "protected route" not providing token. Expect 403 forbidden', async () => {
        // Arrange
        const protectedRoute = genresEP.getAll;

        // Act
        const res = await chai.request(urlServer)
            .get(protectedRoute);
        
        // Assert
        expectBad(res, 403);
    });

    it('accesing "protected route" with invalid token. Expect 401 unauthorized', async () => {
        // Arrange
        const protectedRoute = genresEP.getAll;
        const token = validToken + 'randomString';

        // Act
        const res = await chai.request(urlServer)
            .get(protectedRoute)
            .set('x-access-token', token);
        
        // Assert
        expectBad(res, 401);
    });

    it('accesing "protected route" with valid token. Expect NOT (401 || 403) errors', async () => {
        // Arrange
        const protectedRoute = genresEP.getAll;
        const token = validToken;

        // Act
        const res = await chai.request(urlServer)
            .get(protectedRoute)
            .set('x-access-token', token);
        
        // Assert
        expect(res).to.not.have.status(401);
        expect(res).to.not.have.status(403);
    });
});



describe('Images endpoint', () => {

    describe(`Create image movie. "${imagesEP.createImageMovie}"`, () => {

        it('missing data. Expect 400 bad request', async () => {
            // Arrange
    
            // Act  
            const res = await chai.request(urlServer)
                .post(imagesEP.createImageMovie)
                .type('multipart/form-data; boundary=---XXX')
                .set('x-access-token', validToken);
    
            // Assert
            expectBad(res, 400);
        });

        it('invalid image (file too large). Expect 400 bad request', async () => {
            // Arrange
            const keyName = 'image';
            const imageName = 'invalid-image.jpg';
            const pathImage = sampleFilesPath + imageName;
    
            // Act  
            const res = await chai.request(urlServer)
                .post(imagesEP.createImageMovie)
                .attach(keyName, fs.readFileSync(pathImage), imageName)
                .set('x-access-token', validToken);

            // Assert
            expectBad(res, 400);
        });

        it('good req. Expect 201 and imageData: { id, url }', async () => {
            // Arrange
            const keyName = 'image';
            const imageName = 'valid-image.jpg';
            const pathImage = sampleFilesPath + imageName;
    
            // Act  
            const res = await chai.request(urlServer)
                .post(imagesEP.createImageMovie)
                .attach(keyName, fs.readFileSync(pathImage), imageName)
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 201);
            const { id, url } = res.body.data;
            expect(id).to.be.a('string');
            expect(id).to.not.be.empty;
            expect(url).to.be.a('string');
            expect(url).to.not.be.empty;

            // Save image for other test
            imageToDelete = { id, url };
        });

        it('good req. Save image for use in another tests', async () => {
            // Arrange
            const keyName = 'image';
            const imageName = 'valid-image.jpg';
            const pathImage = sampleFilesPath + imageName;
    
            // Act  
            const res = await chai.request(urlServer)
                .post(imagesEP.createImageMovie)
                .attach(keyName, fs.readFileSync(pathImage), imageName)
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 201);
            const { id, url } = res.body.data;
            expect(id).to.be.a('string');
            expect(id).to.not.be.empty;
            expect(url).to.be.a('string');
            expect(url).to.not.be.empty;
            
            // Save image for other test
            movieImageCreated = { id, url };
        });

    });


    describe(`Update image. "${imagesEP.putById}"`, () => {

        it('invalid id. Expect 404 not found', async () => {
            // Arrange
            const invalidId = 'ae150293-f97c-4b1d-b8db-c30474acb9d7';
            const keyName = 'image';
            const imageName = 'valid-image.jpg';
            const pathImage = sampleFilesPath + imageName;
    
            // Act  
            const res = await chai.request(urlServer)
                .put(imagesEP.putById + invalidId)
                .attach(keyName, fs.readFileSync(pathImage), imageName)
                .set('x-access-token', validToken);

            // Assert
            expectBad(res, 404);
        });

        it('good req. Expect 200 and imageData: { url }', async () => {
            // Arrange
            const validId = imageToDelete.id;
            const keyName = 'image';
            const imageName = 'valid-image.jpg';
            const pathImage = sampleFilesPath + imageName;
    
            // Act  
            const res = await chai.request(urlServer)
                .put(imagesEP.putById + validId)
                .attach(keyName, fs.readFileSync(pathImage), imageName)
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 200);
            const { url } = res.body.data;
            expect(url).to.be.a('string');
            expect(url).to.not.be.empty;
        });

    });


    describe(`Delete image. "${imagesEP.deleteById}"`, () => {

        it('good req. Expect 200 and null data: {  }', async () => {
            // Arrange
            const validId = imageToDelete.id;
    
            // Act  
            const res = await chai.request(urlServer)
                .delete(imagesEP.deleteById + validId)
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 200);
            expect(res.body.data).to.be.null;
        });

    });

});



describe('Genres endpoint', () => {

    describe(`Create genre. "${genresEP.create}"`, () => {

        it('good req. Expect 201 and genreData: {id}', async () => {
            // Arrange
            const genreCreate = {
                name: 'genre name test'
            };
    
            // Act  
            const res = await chai.request(urlServer)
                .post(genresEP.create)
                .send(genreCreate)
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 201);
            const { id } = res.body.data;
            expect(id).to.be.above(0);

            // Saving id for other tests
            genreCreated = genreCreate;
            genreCreated.id = id;
        });

    });

});



describe('Movies endpoint', () => {

    describe(`Create movie. "${moviesEP.create}"`, () => {

        it('missing data. Expect 400 bad request', async () => {
            // Arrange
            const movieCreate = {

            };
    
            // Act  
            const res = await chai.request(urlServer)
                .post(moviesEP.create)
                .send(movieCreate)
                .set('x-access-token', validToken);
    
            // Assert
            expectBad(res, 400);
        });

        it('invalid content-type. Expect 406 not acceptable', async () => {
            // Arrange
            const movieCreate = {
                title: 'movie title test',
            };
    
            // Act  
            const res = await chai.request(urlServer)
                .post(moviesEP.create)
                .type('form')
                .send(movieCreate)
                .set('x-access-token', validToken);

            // Assert
            expectBad(res, 406);
        });

        it('good req. Expect 201 and movieData: {id}', async () => {
            // Arrange
            const movieCreate = {
                title: 'movie title test',
                releaseDate: dayAsString,
                rating: 4.5,
                characters: [],
                genres: genreCreated.id,
                imageId: movieImageCreated.id,
            };
    
            // Act  
            const res = await chai.request(urlServer)
                .post(moviesEP.create)
                .send(movieCreate)
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 201);
            const { id } = res.body.data;
            expect(id).to.be.above(0);

            // Saving data for other test
            movieCreated = movieCreate;
            movieCreated.id = id;
        });

    });


    describe(`Get movie by id. "${moviesEP.getById}"`, () => {

        it('invalid id. Expect 404 not found', async () => {
            // Arrange
            const invalidId = movieCreated.id + 400;
    
            // Act  
            const res = await chai.request(urlServer)
                .get(moviesEP.getById + invalidId)
                .set('x-access-token', validToken);

            // Assert
            expectBad(res, 404);
        });

        it('good req. Expect 200 and movieData: { id, title, genres, releaseDate...}', async () => {
            // Arrange
            const validId = movieCreated.id;
            const movieExpected = {
                id: movieCreated.id,
                title: movieCreated.title,
                rating: movieCreated.rating,
                releaseDate: dayAsString,
                image: movieImageCreated,
                characters: [],
                genres: [
                    {
                        id: genreCreated.id,
                        name: genreCreated.name,
                        image: null,
                    }
                ],
            };

            // Act  
            const res = await chai.request(urlServer)
                .get(moviesEP.getById + validId)
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 200);
            const movie = res.body.data;
            expect(movie).to.deep.equal(movieExpected);
            expect(movie.characters).to.deep.equal(movieExpected.characters);
            expect(movie.genres).to.deep.equal(movieExpected.genres);
        });

    });


    describe(`Get all movies. "${moviesEP.getAll}"`, () => {

        it('search name(title) that exists. Expect 200 and 1 movie Data: {id,title,image}', async () => {
            // Arrange
            const titleExists = movieCreated.title;
            const movieExpected = {
                id: movieCreated.id,
                title: movieCreated.title,
                releaseDate: dayAsString,
                image: {
                    url: movieImageCreated.url,
                },
            };

            // Act  
            const res = await chai.request(urlServer)
                .get(moviesEP.getAll)
                .query({ name: titleExists })
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 200);
            const movies = res.body.data;
            expect(movies).to.satisfy(array => Array.isArray(array) && array.length === 1);
            expect(movies[0]).to.deep.equal(movieExpected);
            expect(movies[0].image).to.deep.equal(movieExpected.image);
        });

        it('filter by genreId that not exists. Expect 200 and 0 movies', async () => {
            // Arrange
            const notExistingGenreId = genreCreated.id + 400;

            // Act  
            const res = await chai.request(urlServer)
                .get(moviesEP.getAll)
                .query({ genre: notExistingGenreId })
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 200);
            const movies = res.body.data;
            expect(movies).to.satisfy(array => Array.isArray(array) && array.length === 0);
        });

    });


    describe(`Update movie by id. "${moviesEP.patchById}"`, () => {

        it('invalid id. Expect 404 not found', async () => {
            // Arrange
            const invalidId = movieCreated.id + 400;
            const paramsUpdate = {
                title: 'movie title test updated',
                rating: 4.9,
            };

            // Act  
            const res = await chai.request(urlServer)
                .patch(moviesEP.patchById + invalidId)
                .send(paramsUpdate)
                .set('x-access-token', validToken);

            // Assert
            expectBad(res, 404);
        });

        it('missing body. Expect 400 bad request', async () => {
            // Arrange
            const validId = movieCreated.id;
            const paramsUpdate = {
                
            };

            // Act  
            const res = await chai.request(urlServer)
                .patch(moviesEP.patchById + validId)
                .send(paramsUpdate)
                .set('x-access-token', validToken);

            // Assert
            expectBad(res, 400);
        });

        it('good req. Expect 200 and null data', async () => {
            // Arrange
            const validId = movieCreated.id;
            const paramsUpdate = {
                title: 'movie title test updated',
                rating: 4.9,
                genres: [],
                genresAction: 'set',
            };

            // Act  
            const res = await chai.request(urlServer)
                .patch(moviesEP.patchById + validId)
                .send(paramsUpdate)
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 200);
            expect(res.body.data).to.be.null;

            // Save data for another test
            movieCreated.title = paramsUpdate.title;
            movieCreated.rating = paramsUpdate.rating;
            movieCreated.genres = paramsUpdate.genres;
            
        });

    });


    describe(`Get movie by id. "${moviesEP.getById}"`, () => {

        it('movie updated. Expect 200 and movieData updated ', async () => {
            // Arrange
            const validId = movieCreated.id;
            const movieExpected = {
                id: movieCreated.id,
                title: movieCreated.title,
                rating: movieCreated.rating,
                releaseDate: dayAsString,
                image: movieImageCreated,
                characters: [],
                genres: [],
            };

            // Act  
            const res = await chai.request(urlServer)
                .get(moviesEP.getById + validId)
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 200);
            const movie = res.body.data;
            expect(movie).to.deep.equal(movieExpected);
            expect(movie.characters).to.deep.equal(movieExpected.characters);
            expect(movie.genres).to.deep.equal(movieExpected.genres);
        });

    });


    describe(`Delete movie by id. "${moviesEP.deleteById}"`, () => {

        it('good req. Expect 200 and null data', async () => {
            // Arrange
            const validId = movieCreated.id;

            // Act  
            const res = await chai.request(urlServer)
                .delete(moviesEP.deleteById + validId)
                .set('x-access-token', validToken);

            // Assert
            expectGood(res, 200);
            expect(res.body.data).to.be.null;
        });

    });


    describe(`Get movie by id. "${moviesEP.getById}"`, () => {

        it('movie deleted. Expect 404 not found', async () => {
            // Arrange
            const movideDeletedId = movieCreated.id;
    
            // Act  
            const res = await chai.request(urlServer)
                .get(moviesEP.getById + movideDeletedId)
                .set('x-access-token', validToken);

            // Assert
            expectBad(res, 404);
        });

    });

});



// FUNCTIONS
function expectBad(res, statusExp) {
    const { type, data } = res.body;
    expect(res).to.have.status(statusExp);
    expect(type).to.equal('error');
    expect(data).to.be.null;
}

function expectGood(res, statusExp) {
    expect(res).to.have.status(statusExp);
    expect(res.body.type).to.equal('success');
}