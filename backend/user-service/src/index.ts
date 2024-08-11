import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import { consume } from './utils/subscriber';
const cors = require('cors');

// Routes
// import {currentUserRouter} from './routes/current-user';
import {usermanagementRouter} from './routes/usermanagement';
// import {logoutRouter} from './routes/logout';
// import {edituserRouter} from './routes/register';

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

// app.use(currentUserRouter);
app.use(usermanagementRouter);
// app.use(edituserRouter);

// // Try to throw not found error
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

const startSubscribers = async () => {
    const exchange = 'user-exchange';
    const exchangeService = 'topic';
    const queue = 'user-queue';
    const routingKey = 'user.*';
    await consume(exchange, exchangeService, queue, routingKey);
}
startSubscribers();

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
}
start();

app.listen(3000, () => {
    console.log('User service listening on port 3000');
});