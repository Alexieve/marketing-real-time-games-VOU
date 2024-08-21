import express, { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Absolute path to the directory where images will be stored
const imageDirectory = path.join(__dirname, '../../image/');

const storage = multer.diskStorage({
    destination: function (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, imageDirectory);
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

router.post('/api/image/uploading', upload.single('imageUrl'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Take out the old image hash
        const { oldImageName } = req.body;
        if (oldImageName) {
            // Delete the old image
            const oldImagePath = path.resolve(imageDirectory, oldImageName);
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    res.status(404).send({ message: 'Image not found to re-upload' });
                }
            });
        }
        console.log("Image uploaded successfully");
        res.status(201).send({ message: 'Image uploaded successfully' });
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export { router as ImageUploadingRoutes };