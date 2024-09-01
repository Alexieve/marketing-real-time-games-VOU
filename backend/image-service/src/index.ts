import express from 'express';
const cors = require('cors');
import 'express-async-errors'

import fs from 'fs';
import path from 'path';

// Routes
import { ImageFetchingRoutes } from './routes/ImageFetching';
import { ImageUploadingRoutes } from './routes/ImageUploading';
import { ImageDeletingRoutes } from './routes/ImageDeleting';

// Middlewares
import { errorHandler } from '@vmquynh-vou/shared';
import { NotFoundError } from '@vmquynh-vou/shared';

const app = express();
const port = 3000;

// app.use(json());
app.use(cors());

/** Routes */
// app.use(ImageFetchingRoutes);
app.use(ImageUploadingRoutes);
app.use(ImageDeletingRoutes);
app.use('/images', express.static(path.join(__dirname, '../images/')));
app.use('/assets', express.static(path.join(__dirname, '../assets/')));

// Try to throw not found error
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Image service listening on port ${port}`);
    const directories = [path.join(__dirname, '../images/voucher'), path.join(__dirname, '../images/event')];
    directories.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
});
