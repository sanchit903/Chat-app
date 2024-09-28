import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connect } from './config.js';
import { chatModel } from './chatSchema.js';
import { error } from 'console';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('Connection is established');

    socket.on('join', (data) => {
        socket.userName = data;
        chatModel.find().sort({ timeStamp: 1 }).limit(50).then((messages) => {
            socket.emit('load_messages', messages);
        }).catch((error) => {
            console.log(error);
        });
    });

    socket.on("new-message", (message) => {
        //   io.emit("new-message", message); // Broadcast the message to all clients
        let userMessage = {
            username: socket.userName,
            message: message
        };

        const newChat = new chatModel({
            username: socket.userName,
            message: message,
            timestamp: new Date()
        });
        newChat.save();

        socket.broadcast.emit('broadcast-message', userMessage);
    });

    socket.on('disconnect', () => {
        console.log('Connection is disconnected')
    });
});

server.listen(3000, () => {
    console.log('App is listening on port 3000');
    connect();
});