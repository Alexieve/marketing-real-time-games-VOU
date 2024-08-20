import express, { Request, Response, NextFunction } from 'express';
import { Voucher } from '../models/VoucherModel';
import { voucherValidator } from '../utils/voucherValidators';
import { validateRequest } from '../middlewares/validate-request';
import { publishToExchanges } from '../utils/publisher';
import { BadRequestError } from '../errors/bad-request-error';
import axios from 'axios';
import multer, { FileFilterCallback } from 'multer';
import crypto from 'crypto';
import FormData from 'form-data'; // Ensure you import FormData from 'form-data'

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

// POST route to create a new voucher
router.post('/api/vouchers/create', upload.single('imageUrl'), voucherValidator, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code, qrCodeUrl, price, description, quantity, expTime, status, brand } = req.body;
        const imageFile = req.file;
        const fileType = imageFile?.mimetype;

        if (!imageFile) {
            throw new BadRequestError('No image uploaded');
        }

        const newImageHash = generateImageHashFromBuffer(imageFile.buffer) + '.' + fileType?.split('/')[1];

        // Create a new voucher
        const newVoucher = Voucher.build({
            code,
            qrCodeUrl,
            imageUrl: newImageHash,
            price,
            description,
            quantity,
            expTime,
            status,
            brand,
            eventId: null
        });

        await newVoucher.save();

        // Send the image to the image service
        const imageName = newVoucher._id + newImageHash;
        const formData = new FormData();
        formData.append('imageUrl', imageFile.buffer, {
            filename: imageName,
            contentType: imageFile.mimetype,
        });

        const uploadImage = await axios.post('http://image-srv:3000/api/image/uploading', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (uploadImage.status !== 201) {
            throw new BadRequestError('Image upload failed');
        }

        // Publish the event to the exchange
        // Append the image URL to the voucher object
        newVoucher.imageUrl = `/api/image/fetching/${imageName}`;
        await publishToExchanges('voucher_created', JSON.stringify(newVoucher.toJSON()));

        console.log('Voucher created successfully');
        res.status(200).send(newVoucher);

    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;