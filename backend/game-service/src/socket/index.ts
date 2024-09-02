import { Server } from 'socket.io';
import { createServer } from 'http';
import { gameEvents } from './game-events';

export const initSocket = (app: any) => {
    const server = createServer(app);
    const io = new Server();

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        gameEvents(io, socket);

        socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        });
    });

    return server;
};
