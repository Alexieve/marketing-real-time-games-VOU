import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
const cors = require('cors');

// Routes
// import {currentUserRouter} from './routes/current-user';
import {usermanagementRouter} from './routes/usermanagement';
import {usermanagementRouter_Load} from './routes/usermanagement_Load';
import {usermanagementRouter_Update} from './routes/usermanagement_Update';
import {usermanagementRouter_Delete} from './routes/usermanagement_Delete';

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
app.use(usermanagementRouter_Load);
app.use(usermanagementRouter_Update);
app.use(usermanagementRouter_Delete);
// app.use(edituserRouter);

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
    console.log('User service listening on port 3000');
});