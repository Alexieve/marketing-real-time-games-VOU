import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';

// Routes
import {currentUserRouter} from './routes/current-user';
import {loginRouter} from './routes/login';
import {logoutRouter} from './routes/logout';
import {registerRouter} from './routes/register';

// Middlewares
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true,
}));

app.use(currentUserRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(registerRouter);

// // Try to throw not found error
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
}

start();

app.listen(3000, () => {
    console.log('Auth service listening on port 3000');
});