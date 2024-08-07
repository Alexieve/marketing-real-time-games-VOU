import express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
const cors = require('cors');

// Routes
import eventRoutes from './routes/Event';

// Middlewares
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

const StartServer = async () => {
 
    await mongoose
        .connect("mongodb://mongodb-event-srv:27017/event")
        .then(() => {
            console.log('Mongo connected successfully.');
        })
        .catch((error) => console.log(error));

    app.use(json());
    app.use(cors());

    /** Routes */
    app.use(eventRoutes);

    // // Try to throw not found error
    app.all('*', async (req, res) => {
        throw new NotFoundError();
    });
    app.use(errorHandler);

    app.listen(3001, () => {
        console.log('Event service listening on port 3001');
    });
};

StartServer();
