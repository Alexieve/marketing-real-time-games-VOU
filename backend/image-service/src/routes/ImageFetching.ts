import express, { Request, Response } from 'express';
import path from 'path';

const router = express.Router();

router.get('/api/image/fetching/:filename', async (req: Request, res: Response) => {
    const { filename } = req.params;
    // Absolute path to the image file
    const [objectType, fileName] = filename.split('_');
    const imagePath = path.resolve(__dirname, `../../image/${objectType}/`, fileName);
    // Send the image file as a response 
    res.status(200).sendFile(imagePath);
});

export { router as ImageFetchingRoutes };
