const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const users = require('./routes/users');
const posts = require('./routes/posts');
const comments = require('./routes/comments');
const HttpError = require('./errors/http-error');

const app = express();

const PORT = process.env.SERVER_PORT || 3000;
const DB_HOST = process.env.HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || '27017';
const DATABASE = process.env.DATABASE || 'test';
const DB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DATABASE}`;

if (process.env.NODE_ENV !== "production") {
    // only use env file in development, set values directly
    // on the respective host in production
    console.log("-- DEV ACTIVE --");
    require('dotenv').config();
    app.use(morgan('dev'));  
    if (process.env.NODE_ENV === "development") {
        mongoose.set('debug', true);
    }
}

const errorLogger = (err, req, res, next) => {
    console.log(`Error encountered: ${req.path}`);
    console.log(`Error type: ${err.name}`);
    next(err);
}

const errorHandler = ((err, req, res, next) => {
    console.error(err);
    if (!(err instanceof HttpError)) {
        console.error("Not a HTTP error");

        if (err.name === 'ValidationError') {
            console.error("Validation error");
            err = new HttpError(err, 400);
        } else err = new HttpError(err, err.statusCode || 500);
    }
    res.type('application/json');
    return res.status(err.statusCode).json({ error: err.toString() });
});

app.use(helmet());
app.options('*', cors()); // enable pre-flight request for routes other than GET/HEAD/POST
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // serve files in the 'public' directory
app.use('/user', users);
app.use('/post', posts);
app.use('/comment', comments);
app.use(errorLogger);
app.use(errorHandler);

if (process.env.NODE_ENV === 'test') {
    connect(DB_URI);
} else main();

async function main() {
    const db = await connect(DB_URI);
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.on('connection', console.log.bind(console, 'MongoDB connection:'));
    const server = app.listen(PORT, () => {
        console.log(`Server up on ${server.address().address}:${PORT}`);
    });
}

async function connect(URI) {
    await mongoose.connect(URI, { useNewUrlParser: true })
        .then(() => console.log("Database connected"));
    return mongoose.connection;
}

module.exports = app;