import express from 'express';
import { connectToDatabase } from './connection';
const cors = require('cors');

// Routes
import eventCreateRouter from './routes/EventCreate';
import eventDeleteRouter from './routes/EventDelete';
import eventUpdateRouter from './routes/EventUpdate';
import eventGetAllRouter from './routes/EventGetAll';
import eventGetByIdRouter from './routes/EventGetById';

import voucherCreateRouter from './routes/VoucherCreate';
import voucherDeleteRouter from './routes/VoucherDelete';
import voucherUpdateRouter from './routes/VoucherUpdate';
import voucherGetAllRouter from './routes/VoucherGetAll';
import voucherGetByIdRouter from './routes/VoucherGetById';

import { connectRabbitMQ } from './utils/publisher';

// Middlewares
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
const port = 3000;
app.use(cors());

/** Routes */
app.use(eventCreateRouter);
app.use(eventDeleteRouter);
app.use(eventUpdateRouter);
app.use(eventGetAllRouter);
app.use(eventGetByIdRouter);

app.use(voucherCreateRouter);
app.use(voucherDeleteRouter);
app.use(voucherUpdateRouter);
app.use(voucherGetAllRouter);
app.use(voucherGetByIdRouter);

// // Try to throw not found error
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

app.listen(port, async () => {
    console.log(`Event service listening on port ${port}`);
    await connectToDatabase();
    // Connect to RabbitMQ
    await connectRabbitMQ();
});
