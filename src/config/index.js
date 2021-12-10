require('dotenv').config();

module.exports = {
    app: {
        port: parseInt(process.env.PORT) || 3000,
        apiRout: '/api',
        staticRout: '/static',
        staticAddress: '', // filled in bin/www e.g. 'http://localhost:3000/static'
    },
    db: {
        connString: process.env.DATABASE_URL, // postgres://user:pass@host.com:5432/dbname
        schema:'public',
    },
    env: process.env.ENV || 'dev', // prod, dev, test
};
