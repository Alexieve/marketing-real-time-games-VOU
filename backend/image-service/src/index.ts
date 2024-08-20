import express from 'express';
import { json } from 'body-parser';
const cors = require('cors');

// Routes
import { ImageFetchingRoutes } from './routes/ImageFetching';
import { ImageUploadingRoutes } from './routes/ImageUploading';
import { ImageDeletingRoutes } from './routes/ImageDeleting';

// Middlewares
// import { errorHandler } from './middlewares/error-handler';
// import { NotFoundError } from './errors/not-found-error';

const app = express();
const port = 3000;

// app.use(json());
app.use(cors());

/** Routes */
app.use(ImageFetchingRoutes);
app.use(ImageUploadingRoutes);
app.use(ImageDeletingRoutes);

// // Try to throw not found error
// app.all('*', async (req, res) => {
//     throw new NotFoundError();
// });
// app.use(errorHandler);

app.listen(port, () => {
    console.log(`Image service listening on port ${port}`);
});
