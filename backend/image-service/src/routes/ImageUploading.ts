import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { BadRequestError } from '@vmquynh-vou/shared';

import path from 'path';
import fs from 'fs';

const router = express.Router();

// Absolute path to the directory where images will be stored
const imageDirectory = path.join(__dirname, '../../images/');

const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        const { objectType } = req.body;
        cb(null, imageDirectory + objectType + '/');
    },
    filename: function (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

router.post('/api/image/uploading', upload.single('imageUrl'), async (req: Request, res: Response) => {
    if (!req.file) {
        throw new BadRequestError('No image uploaded');
    }

    // Take out the old image hash
    const { objectType, oldImageName } = req.body;

    if (oldImageName) {
        // Delete the old image 
        const oldImagePath = path.resolve(imageDirectory + objectType + '/', oldImageName);
        fs.unlink(oldImagePath, (err) => {
            if (err) {
                throw new BadRequestError('Image not found to update');
            }
        });
    }

    const imageUrl = '/images/' + objectType + '/' + req.file.originalname;
    console.log("Image uploaded successfully");
    res.status(201).send({ message: 'Image uploaded successfully', imageUrl: imageUrl });
});

export { router as ImageUploadingRoutes };