import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import path from 'path';
import fs from 'fs';
import { BadRequestError } from '@vmquynh-vou/shared';

const router = express.Router();
router.use(json());

// Absolute path to the directory where images will be stored
const imageDirectory = path.join(__dirname, '../../');

router.delete('/api/image/deleting/*', async (req: Request, res: Response) => {
    // Take out the old image hash
    const imageName = req.params[0];
    if (imageName) {
        // Delete the old image
        const oldImagePath = path.resolve(imageDirectory, imageName);
        // Check if the image exists
        if (!fs.existsSync(oldImagePath)) {
            throw new BadRequestError('Image not found to delete');
        }
        // Delete the image
        fs.unlink(oldImagePath, (err) => {
            if (err) {
                throw new BadRequestError('Something went wrong while deleting the image');
            }
        });
    }
    console.log("Image deleted successfully");
    res.status(200).send({ message: 'Image deleted successfully' });
});

export { router as ImageDeletingRoutes };