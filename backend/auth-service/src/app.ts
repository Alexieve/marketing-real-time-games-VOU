import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
const cors = require('cors');

// Routes
import {currentUserRouter} from './routes/current-user';
import {loginRouter} from './routes/login';
import {logoutRouter} from './routes/logout';
import {registerRouter} from './routes/register';

// Middlewares
import {errorHandler} from '@vmquynh-vou/shared';
import {NotFoundError} from '@vmquynh-vou/shared';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    // secure: true,
}));
app.use(cors());

app.use(currentUserRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(registerRouter);

// // Try to throw not found error
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };