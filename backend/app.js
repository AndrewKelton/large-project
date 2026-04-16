/**
 * app.js — Express app factory used by integration tests.
 * Does NOT connect to MongoDB or start listening on a port.
 * server.js imports this and adds the DB connection + listen call.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

const corsOptions = {
    origin: ['http://leandrovivares.com', 'https://leandrovivares.com', 'http://localhost', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

app.use('/api/register',           require('./api/register.js'));
app.use('/api',                    require('./api/login.js'));
app.use('/api/courses',            require('./api/courses.js'));
app.use('/api/professors',         require('./api/professors.js'));
app.use('/api/ratings',            require('./api/createRatings.js'));
app.use('/api/fetchRatings',       require('./api/fetchRatings.js'));
app.use('/api/fetchCAP',           require('./api/fetchCAP.js'));
app.use('/api/fetchCO',            require('./api/fetchCO.js'));
app.use('/api/createQuestionnaire',require('./api/createQuestionnaire.js'));
app.use('/api/userSettings',       require('./api/userSettings.js'));
app.use('/api/updateUser',         require('./api/updateUser.js'));
app.use('/api/respondToCAP',       require('./api/respondToCAP.js'));
app.use('/api/respondToCO',        require('./api/respondToCO.js'));
app.use('/api/user',               require('./api/user.js'));
app.use('/api/searchCO',           require('./api/searchCO.js'));
app.use('/api/searchCAP',          require('./api/searchCAP.js'));
app.use('/api/auth',               require('./api/twoFactorAuth.js'));

app.get('/api/ping', (req, res) => {
    res.json({ message: 'Hello Group 7', status: 'Server OK' });
});

module.exports = app;
