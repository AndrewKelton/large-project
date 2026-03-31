require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// mongoose schemas
const User = require('./models/user.js');

const app = express();

app.use(express.json());

// allow requests from the front-end origin
const corsOptions = {
        origin: ['http://leandrovivares.com', 'http://localhost', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
};
app.use(cors(corsOptions));

const registerRouter = require('./api/register.js');
app.use('/api/register', registerRouter);

const loginRouter = require('./api/login.js');
app.use('/api', loginRouter);

const courseRouter = require('./api/courses.js');
app.use('/api/courses', courseRouter);

// connect to database via mongoose
const url = process.env.MONGO_URI;
mongoose.connect(url)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// example API no input simple response, send GET request on postman to http://137.184.68.139:3000/api/ping
app.get('/api/ping', (req, res) => {
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting', 'uninitialized'];
    const dbState = dbStates[mongoose.connection.readyState] || 'Something is very wrong';
    res.json({message: 'Hello Group 7', status: 'Server OK', database: dbState});
});

// example API through mongoose
app.post('/user', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// open port for express to listen to
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
