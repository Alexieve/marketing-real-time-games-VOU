import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import { RedisClient } from '@vmquynh-vou/shared';
const cors = require('cors');

// Routes
import { GameRoute } from './routes/game-route';
import { EventGameRoute } from './routes/event-game-route';
import { GameItemRoute } from './routes/game-item-route';
import { PlayLogRoute } from './routes/play-log-route';

// Middlewares
import {errorHandler} from '@vmquynh-vou/shared';
import {NotFoundError} from '@vmquynh-vou/shared';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true,
}));
app.use(cors());

app.use(GameRoute);
app.use(EventGameRoute);
app.use(GameItemRoute);
app.use(PlayLogRoute);

// // Try to throw not found error
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);


const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    await RedisClient.getInstance();

    app.listen(3000, () => {
        console.log('Game service listening on port 3000');
    });
}

start();