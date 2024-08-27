import express, { Request, Response, NextFunction } from 'express';
import { Voucher } from '../models/VoucherCommandModel';
import { voucherValidator } from '../utils/voucherValidators';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { publishToExchanges } from '../utils/publisher';
import axios from 'axios';
import multer, { FileFilterCallback } from 'multer';
import crypto from 'crypto';
import FormData from 'form-data';

const router = express.Router();

const storage = multer.memoryStorage();
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

const generateImageHashFromBuffer = (buffer: Buffer): string => {
    return crypto.createHash('sha256').update(buffer).digest('hex');
};

const uploadImageToService = async (imageFile: Express.Multer.File, newImageName: string, oldImageName?: string) => {
    const formData = new FormData();
    formData.append('imageUrl', imageFile.buffer, {
        filename: newImageName,
        contentType: imageFile.mimetype,
    });

    if (oldImageName) {
        formData.append('oldImageName', oldImageName);
    }

    const response = await axios.post('http://image-srv:3000/api/image/uploading', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    if (response.status !== 201) {
        throw new BadRequestError('Image upload failed');
    }
};

router.put('/api/event_command/voucher/update/:id', upload.single('imageUrl'), voucherValidator, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { code, qrCodeUrl, price, description, quantity, expTime, status, brand } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            throw new BadRequestError('No image uploaded');
        }

        const voucher = await Voucher.findById(id);
        if (!voucher) {
            throw new BadRequestError('Voucher not found');
        }

        const newImageHash = generateImageHashFromBuffer(imageFile.buffer) + '.' + imageFile.mimetype.split('/')[1];
        const newImageUrl = `/api/image/fetching/${voucher._id + newImageHash}`;
        const oldImageUrl = voucher.imageUrl;

        const updateData = {
            code,
            qrCodeUrl,
            imageUrl: newImageUrl,
            price,
            description,
            quantity,
            expTime,
            status,
            brand,
        };

        voucher.set(updateData);
        await voucher.save();

        if (oldImageUrl !== newImageUrl) {
            const oldImageName = oldImageUrl.split('/').pop();
            const newImageName = newImageUrl.split('/').pop();
            await uploadImageToService(imageFile, newImageName!, oldImageName);
        }

        await publishToExchanges('voucher_updated', JSON.stringify(voucher.toJSON()));

        console.log('Voucher updated successfully');
        res.status(200).send(voucher);

    } catch (error) {
        console.log(error);
        next(error);
    }
});

export = router;