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
    auth: {
        saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
        tokenKey: process.env.TOKEN_KEY || 'super-super-secret',
        tokenOptions: {
            algorithm: process.env.TOKEN_ALGORITHM || 'HS256',
            expiresIn: '1y',
        },
    },
    sendGrid: {
        sendEmails: process.env.SEND_EMAILS.toLocaleLowerCase() === 'true'? true : false,
        apiKey: process.env.SENDGRID_API_KEY,
        defaultFromEmail: process.env.DEFAULT_FROM_EMAIL,
    },
};
