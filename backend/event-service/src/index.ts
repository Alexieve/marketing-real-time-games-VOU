import express from 'express';
import { connectToDatabase } from './connection';
import bodyParser, { json } from 'body-parser';
const cors = require('cors');

// Routes
import eventCreateRouter from './routes/EventCreate';
import eventDeleteRouter from './routes/EventDelete';
import eventUpdateRouter from './routes/EventUpdate';
import voucherCreateRouter from './routes/VoucherCreate';
import voucherDeleteRouter from './routes/VoucherDelete';
import voucherUpdateRouter from './routes/VoucherUpdate';

import { connectRabbitMQ } from './utils/publisher';

// Middlewares
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
const port = 3000;
// Middleware to parse multipart/form-data
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); 

/** Routes */
app.use(eventCreateRouter);
app.use(eventDeleteRouter);
app.use(eventUpdateRouter);
app.use(voucherCreateRouter);
app.use(voucherDeleteRouter);
app.use(voucherUpdateRouter);

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
