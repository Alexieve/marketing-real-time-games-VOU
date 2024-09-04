import express, { Request, Response } from 'express';
import { Voucher } from '../models/VoucherCommandModel';
import { voucherValidator } from '../utils/voucherValidators';
import { validateRequest } from '../middlewares/validate-request';
import { publishToExchanges } from '../utils/publisher';
import { BadRequestError } from '../errors/bad-request-error';
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

const uploadImageToService = async (imageFile: Express.Multer.File, imageName: string) => {
    const formData = new FormData();
    formData.append('objectType', 'voucher');
    formData.append('imageUrl', imageFile.buffer, {
        filename: imageName,
        contentType: imageFile.mimetype,
    });

    const response = await axios.post('http://image-srv:3000/api/image/uploading', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data.imageUrl;
};

router.post('/api/event_command/voucher/create', upload.single('imageUrl'), voucherValidator, validateRequest, async (req: Request, res: Response) => {
    const { code, price, description, quantity, expTime, status, brand } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
        throw new BadRequestError('No image uploaded');
    }

    // Checking whether already exists a voucher with the same code
    const existingVoucher = await Voucher.findOne({ code: code });
    if (existingVoucher) {
        throw new BadRequestError('Voucher with the same code already exists');
    }

    const newImageHash = generateImageHashFromBuffer(imageFile.buffer) + '.' + imageFile.mimetype.split('/')[1];

    const newVoucher = Voucher.build({
        code,
        imageUrl: '',
        price,
        description,
        quantity,
        expTime,
        status,
        brand,
        eventID: null
    });

    await newVoucher.save();

    const ImageName = newVoucher._id + newImageHash;

    const newImageUrl = await uploadImageToService(imageFile, ImageName);

    newVoucher.imageUrl = newImageUrl;
    await newVoucher.save();

    await publishToExchanges('voucher_created', JSON.stringify(newVoucher.toJSON()));

    console.log('Voucher created successfully');
    res.status(200).send(newVoucher);
});

export = router;