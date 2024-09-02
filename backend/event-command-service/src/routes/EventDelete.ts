import express, { Request, Response } from 'express';
import { Event } from '../models/EventCommandModel';
import { Voucher } from '../models/VoucherCommandModel';
import { BadRequestError } from '../errors/bad-request-error';
import { publishToExchanges } from '../utils/publisher';
import axios from 'axios';

const router = express.Router();

router.use(express.json());

router.delete('/api/event_command/event/delete/:eventID', async (req: Request, res: Response) => {
    const { eventID } = req.params;
    // Find the event by id and delete it
    const event = await Event.findByIdAndDelete(eventID);
    // If the event is not found, throw an error
    if (!event) {
        throw new BadRequestError('Event not found');
    }
    // Adjust the vouchers by setting the event id to null 
    await Voucher.updateMany({ eventID: eventID }, { eventID: null });

    // Delete the image from the image service
    const imageName = 'event/' + event.imageUrl.split('/').pop();
    const response = await axios.delete(`http://image-srv:3000/api/image/deleting/${imageName}`);

    console.log('Event deleted successfully');
    await publishToExchanges('event_deleted', event._id);
    res.status(200).send({ message: 'Event deleted successfully' });
});

export = router;
