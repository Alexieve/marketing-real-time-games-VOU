import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Event } from '../models/EventCommandModel';
import { Voucher } from '../models/VoucherCommandModel';
import { eventValidator } from '../utils/eventValidators';
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

const uploadImageToService = async (imageFile: Express.Multer.File, imageName: string) => {
    const formData = new FormData();
    formData.append('objectType', 'event');
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

router.post('/api/event_command/event/create', upload.single('imageUrl'), eventValidator, validateRequest, async (req: Request, res: Response) => {
    const { name, description, startTime, endTime, brand, gameID, playTurn, vouchers: vouchersJson } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
        throw new BadRequestError('No image uploaded');
    }

    const vouchers = JSON.parse(vouchersJson);

    const newImageHash = generateImageHashFromBuffer(imageFile.buffer) + '.' + imageFile.mimetype.split('/')[1];

    const event = Event.build({
        name,
        imageUrl: '',
        description,
        startTime,
        endTime,
        brand,
        game: {
            gameID,
            playTurn
        }
    });


    await event.save();

    await Voucher.updateMany({ _id: { $in: vouchers } }, { eventId: event._id });

    const imageName = event._id + newImageHash;

    const newImageUrl = await uploadImageToService(imageFile, imageName);

    event.imageUrl = newImageUrl;
    await event.save();

    const payLoad = {
        _id: event._id,
        name,
        imageUrl: newImageUrl,
        description,
        startTime,
        endTime,
        brand,
        vouchers,
        gameID
    };

    await publishToExchanges('event_created', JSON.stringify(payLoad));

    console.log("Event created successfully");
    res.status(200).send(payLoad);

});

export = router;