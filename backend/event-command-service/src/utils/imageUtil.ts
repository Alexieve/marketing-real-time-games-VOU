import { Request } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import axios from 'axios';
import multer, { FileFilterCallback } from 'multer';
import crypto from 'crypto';
import FormData from 'form-data';

export const generateImageHashFromBuffer = (buffer: Buffer): string => {
    return crypto.createHash('sha256').update(buffer).digest('hex');
};

export const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            const error = new BadRequestError('Unsupported file type. Only JPEG and PNG are allowed.');
            cb(error);
        }
    }
});

export const uploadImageToService = async (imageFile: Express.Multer.File, objectType: string, imageName: string, oldImageName: string = '') => {
    const formData = new FormData();
    formData.append('objectType', objectType);
    formData.append('imageUrl', imageFile.buffer, {
        filename: imageName,
        contentType: imageFile.mimetype,
    });
    if (oldImageName != '') {
        formData.append('oldImageName', oldImageName);
    }

    const response = await axios.post('http://image-srv:3000/api/image/uploading', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data.imageUrl;
};