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

    await Voucher.updateMany({ _id: { $in: vouchers } }, { eventID: event._id });

    const imageName = event._id + newImageHash;

    const newImageUrl = await uploadImageToService(imageFile, 'event', imageName);

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

    // Call API to create gameEvent in game-service
    await axios.post('http://game-srv:3000/api/game/event-game-config', {
        gameID,
        eventID: event._id,
        playTurn
    });

    await publishToExchanges('event_created', JSON.stringify(payLoad));

    console.log("Event created successfully");
    res.status(200).send(payLoad);
});

export = router;