import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import { rabbitMQWrapper } from '@vmquynh-vou/shared';
import { BrandCreatedListener } from './events/listeners/user-created-listener';
const cors = require('cors');

// Routes
import {CreateRoute} from './routes/create';
import {LoadRoute} from './routes/load';
import {UpdateRoute} from './routes/update';
import {DeleteRoute} from './routes/delete';
import {CountPageRoute} from './routes/count-page';


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

app.use(CreateRoute);
app.use(LoadRoute);
app.use(UpdateRoute);
app.use(DeleteRoute);
app.use(CountPageRoute);

// // Try to throw not found error
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);


const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    // try {
    //     await rabbitMQWrapper.connect('amqp://rabbitmq');
    //     await new BrandCreatedListener(rabbitMQWrapper.connection).listen();
    // } catch (error) {
    //     console.error(error);
    // }

    app.listen(3000, () => {
        console.log('User service listening on port 3000');
    });
}

start();