import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import path from 'path';
import fs from 'fs';

const router = express.Router();
router.use(json());

// Absolute path to the directory where images will be stored
const imageDirectory = path.join(__dirname, '../../image/');

router.delete('/api/image/deleting/:imageName', async (req: Request, res: Response) => {
    try {
        // Take out the old image hash
        const { imageName } = req.params;
        if (imageName) {
            // Delete the old image
            const oldImagePath = path.resolve(imageDirectory, imageName);
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    res.status(404).send({ message: 'Image not found to delete' });
                }
            });
        }
        res.status(200).send({ message: 'Image deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Deleting image failed' });
    }
});

export { router as ImageDeletingRoutes };