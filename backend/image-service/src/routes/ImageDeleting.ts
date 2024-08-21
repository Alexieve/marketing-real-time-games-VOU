import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import path from 'path';
import fs from 'fs';

const router = express.Router();
router.use(json());

// Absolute path to the directory where images will be stored
const imageDirectory = path.join(__dirname, '../../image/');

router.delete('/api/image/deleting/:imageName', async (req: Request, res: Response, next: NextFunction) => {
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
        console.log("Image deleted successfully");
        res.status(200).send({ message: 'Image deleted successfully' });
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export { router as ImageDeletingRoutes };