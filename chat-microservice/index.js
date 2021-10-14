require("dotenv").config();

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.json({
        status: "success",
        data: {
            message: "chat component is working"
        }
    });
});

// Event 'connection': Fired upon a connection from client
io.on("connection", socket => {
    socket.on("message", message => {
        io.emit(message.interviewId, message.message);
    });
});

const port = process.env.PORT || 8002;
server.listen(port, () => {
    console.log(`Chat microservice listening on port ${port}`);
});
