import express, { Request, Response, NextFunction } from 'express';
import { Event } from '../models/EventModel';
import { Voucher } from '../models/VoucherModel';
import { eventValidator } from '../utils/eventValidators';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { publishToExchanges } from '../utils/publisher';
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

router.post('/api/events/create', upload.single('imageUrl'), eventValidator, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the required fields from the request body
        const { name, description, startTime, endTime } = req.body;
        const imageFile = req.file;
        const fileType = imageFile?.mimetype;
        // Json string to array
        const vouchers = JSON.parse(req.body.vouchers);
        const games = JSON.parse(req.body.games);

        if (!imageFile) {
            throw new BadRequestError('No image uploaded');
        }

        const newImageHash = generateImageHashFromBuffer(imageFile.buffer) + '.' + fileType?.split('/')[1];

        // Create a new event
        const event = Event.build({
            name,
            imageUrl: newImageHash,
            description,
            startTime,
            endTime,
        });

        await event.save();

        // Assign the event id to the vouchers
        for (let i = 0; i < vouchers.length; i++) {
            const voucher = await Voucher.findByIdAndUpdate(vouchers[i], { eventId: event._id }, { new: true });
            if (!voucher) {
                throw new BadRequestError('Voucher not found');
            }
        }

        // Send the image to the image service
        const imageName = event._id + newImageHash;
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

        // Publish the event to the exchanges
        const payLoad = {
            _id: event._id,
            name: name,
            imageUrl: `/api/image/fetching/${imageName}`,
            description: description,
            startTime: startTime,
            endTime: endTime,
            vouchers: vouchers,
            games: games
        }

        await publishToExchanges('event_created', JSON.stringify(payLoad));
        console.log("Event created successfully");
        res.status(200).send(payLoad);

    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;
