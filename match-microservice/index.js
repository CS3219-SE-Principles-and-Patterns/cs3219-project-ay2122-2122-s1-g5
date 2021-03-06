const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
var corsOptions = {
    origin: ['https://peerprep.ml', 'https://peerprep-g5.tk', 'http://localhost:3000'],
    credentials: true 
};
app.use(cors(corsOptions));
require("dotenv").config();

const matchApiRoutes = require('./routes/matchApiRoutes');
const responseStatus = require('./common/status/responseStatus');
const clientErrors = require('./common/errors/clientErrors');

// Connect to mongodb
var dbURI = process.env.MONGODB_URI;
if (process.env.NODE_ENV === "test") {
    dbURI = process.env.TEST_MONGODB_URI;
}

const port = process.env.PORT || 8001;
app.listen(port, async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');
        console.log(`Match microservice listening on port ${port}`);
    } catch (err) {
        console.log(err)
    }
});

// Use the match API routes
app.use('/api/match', matchApiRoutes);

app.use((req, res) => {
    res.status(404).json({
        status: responseStatus.FAILED,
        data: {
            message: clientErrors.INVALID_API_ENDPOINT
        }
    });
});

// Export app for testing purposes
module.exports = app;