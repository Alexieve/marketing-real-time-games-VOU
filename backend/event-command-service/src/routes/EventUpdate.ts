import express, { Request, Response } from 'express';
import { Event } from '../models/EventCommandModel';
import { Voucher } from '../models/VoucherCommandModel';
import { eventValidator } from '../utils/eventValidators';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { publishToExchanges } from '../utils/publisher';
import { generateImageHashFromBuffer, uploadImageToService, upload } from '../utils/imageUtil';
import axios from 'axios';

const router = express.Router();

router.put('/api/event_command/event/edit/:eventID', upload.single('imageUrl'), eventValidator, validateRequest, async (req: Request, res: Response) => {
    const { eventID } = req.params;
    const { name, description, startTime, endTime, brand, gameID, playTurn, vouchers: vouchersJson } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
        throw new BadRequestError('No image uploaded');
    }

    const vouchers = JSON.parse(vouchersJson);

    const newImageHash = generateImageHashFromBuffer(imageFile.buffer) + '.' + imageFile.mimetype.split('/')[1];
    const event = await Event.findById(eventID);

    if (!event) {
        throw new BadRequestError('Event not found');
    }

    const newImageName = event._id + newImageHash;
    const oldImageName = event.imageUrl.split('/').pop() ?? '';

    let newImageUrl = '';
    if (newImageName !== oldImageName) {
        newImageUrl = await uploadImageToService(imageFile, 'event', newImageName, oldImageName);
    }
    else {
        newImageUrl = event.imageUrl
    }

    event.set({
        name,
        imageUrl: newImageUrl,
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
    await Voucher.updateMany({ _id: { $in: vouchers } }, { eventID: eventID });
    await Voucher.updateMany({ eventID: eventID, _id: { $nin: vouchers } }, { eventID: null });

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

    // Call API to create gameEvent in game-service
    await axios.put('http://game-srv:3000/api/game/event-game-config', {
        gameID,
        eventID: event._id,
        playTurn
    });

    await publishToExchanges('event_updated', JSON.stringify(payLoad));

    res.status(200).send(payLoad);

});

export = router;