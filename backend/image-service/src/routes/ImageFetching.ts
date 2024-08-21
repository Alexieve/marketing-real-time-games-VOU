import express, { Request, Response } from 'express';
import path from 'path';

const router = express.Router();

router.get('/api/image/fetching/:filename', async (req: Request, res: Response) => {
    try {
        const { filename } = req.params;
        const imagePath = path.resolve(__dirname, '../../image', filename);
        // Send the image file as a response 
        res.sendFile(imagePath, (err) => {
            if (err) {
                res.status(404).send({ message: 'Image not found' });
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

export { router as ImageFetchingRoutes };
