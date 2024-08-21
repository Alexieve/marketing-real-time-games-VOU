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

router.put('/api/events/edit/:eventId', upload.single('imageUrl'), eventValidator, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { eventId } = req.params;
        // Extract the required fields from the request body
        const { name, description, startTime, endTime, brand } = req.body;
        const imageFile = req.file;
        const fileType = imageFile?.mimetype;
        // Json string to array
        const vouchers = JSON.parse(req.body.vouchers);
        const games = JSON.parse(req.body.games);

        if (!imageFile) {
            throw new BadRequestError('No image uploaded');
        }

        const newImageHash = generateImageHashFromBuffer(imageFile.buffer) + '.' + fileType?.split('/')[1];

        // Find event by id
        const event = await Event.findById(eventId);

        if (!event) {
            throw new BadRequestError('Event not found');
        }

        // Take out the old image hash
        const oldImageHash = event.imageUrl;

        // Update the event
        const updateData = {
            name,
            imageUrl: newImageHash,
            description,
            startTime,
            endTime,
            brand,
        };

        event.set(updateData);
        const updatedEvent = await event.save();

        const oldImageName = event._id + oldImageHash;
        const newImageName = event._id + newImageHash;

        // Compare the old and new image hashes
        if (oldImageHash !== newImageHash) {
            // Send the image to the image service
            const formData = new FormData();
            formData.append('imageUrl', imageFile.buffer, {
                filename: newImageName,
                contentType: imageFile.mimetype,
            });
            formData.append('oldImageName', oldImageName);

            const uploadImage = await axios.post('http://image-srv:3000/api/image/uploading', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (uploadImage.status !== 201) {
                throw new BadRequestError('Image upload failed');
            }
        }

        // Update eventId in new vouchers
        await Voucher.updateMany({ _id: { $in: vouchers } }, { eventId: eventId });
        // Update eventId in old vouchers which are not in the new vouchers list
        await Voucher.updateMany({ eventId: eventId, _id: { $nin: vouchers } }, { eventId: null });

        // Publish the updated event to the exchanges
        const payLoad = {
            _id: updatedEvent._id,
            name: name,
            imageUrl: `/api/image/fetching/${newImageName}`,
            description: description,
            startTime: startTime,
            endTime: endTime,
            brand: brand,
            vouchers: vouchers,
            games: games
        }

        await publishToExchanges('event_updated', JSON.stringify(payLoad));
        console.log('Event updated successfully');
        res.status(200).send(payLoad);

    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;
