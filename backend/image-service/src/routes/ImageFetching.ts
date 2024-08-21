import express, { Request, Response, NextFunction } from 'express';
import path from 'path';

const router = express.Router();

router.get('/api/image/fetching/:filename', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filename } = req.params;
        const imagePath = path.resolve(__dirname, '../../image', filename);
        // Send the image file as a response 
        res.status(200).sendFile(imagePath);
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export { router as ImageFetchingRoutes };
