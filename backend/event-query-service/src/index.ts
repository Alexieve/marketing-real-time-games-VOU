import express from 'express';
import 'express-async-errors'
import { connectToDatabase } from './connection';
import { json } from 'body-parser';
const cors = require('cors');

// Routes 
import eventQueryRoutes from './routes/EventQuery';
import voucherQueryRoutes from './routes/VoucherQuery';
import gameQueryRoutes from './routes/GameQuery';

// Subscriber
import { connectRabbitMQ, subscribeToExchanges } from './utils/subscriber';

// Middlewares
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
const port = 3000;

app.use(json());
app.use(cors());

/** Routes */
app.use(eventQueryRoutes);
app.use(voucherQueryRoutes);
app.use(gameQueryRoutes);

app.use(errorHandler);

// // Try to throw not found error 
app.all('*', async (req, res, NextFunction) => {
    throw new NotFoundError();
});

app.listen(port, async () => {
    console.log(`Event query service listening on port ${port}`);
    //Pending for 5 seconds
    await connectToDatabase();
    // Connect to RabbitMQ
    await connectRabbitMQ();
    // Start the subscriber 
    await subscribeToExchanges();
});
