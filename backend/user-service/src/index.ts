import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
// import { rabbitMQWrapper } from './rabbitmq-wrapper';
import { rabbitMQWrapper } from '@vmquynh-vou/shared';
import { BrandCreatedListener } from './events/listeners/user-created-listener';
const cors = require('cors');
import {usermanagementRouter_CountPage} from './routes/usermanagement_CountPage';

// Routes
import {postRouter} from './routes/post';
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
app.use(cookieSession({
    signed: false,
    secure: true,
}));
app.use(cors());

app.use(postRouter);
app.use(usermanagementRouter);
app.use(usermanagementRouter_Load);
app.use(usermanagementRouter_Update);
app.use(usermanagementRouter_Delete);
// app.use(edituserRouter);
app.use(usermanagementRouter_CountPage);

// // Try to throw not found error
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);


const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    try {
        await rabbitMQWrapper.connect('amqp://rabbitmq');
        await new BrandCreatedListener(rabbitMQWrapper.connection).listen();
    } catch (error) {
        console.error(error);
    }

    app.listen(3000, () => {
        console.log('User service listening on port 3000');
    });
}

start();