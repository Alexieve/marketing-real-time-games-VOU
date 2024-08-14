import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
const cors = require('cors');

// Routes
import { getRouter } from './routes/get';
import { postRouter } from './routes/post';
import {usermanagementRouter} from './routes/usermanagement';

// Middlewares
import {errorHandler} from '@vmquynh-vou/shared';
import {NotFoundError} from '@vmquynh-vou/shared';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cors());

app.use(getRouter);
app.use(postRouter);
app.use(usermanagementRouter);

// // Try to throw not found error
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
    console.log('User service listening on port 3000');
});