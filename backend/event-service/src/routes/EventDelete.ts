import express, { Request, Response, NextFunction } from 'express';
import { Event } from '../models/EventModel';
import { Voucher } from '../models/VoucherModel';
import { BadRequestError } from '../errors/bad-request-error';
import { publishToExchanges } from '../utils/publisher';
import axios from 'axios';

const router = express.Router();

router.use(express.json());

router.delete('/api/events/delete/:eventId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { eventId } = req.params;
        // Find the event by id and delete it
        const event = await Event.findByIdAndDelete(eventId);
        // If the event is not found, throw an error
        if (!event) {
            throw new BadRequestError('Event not found');
        }
        // Adjust the vouchers by setting the event id to null 
        await Voucher.updateMany({ eventId: eventId }, { eventId: null });

        // Delete the image from the image service
        const imageName = event._id + event.imageUrl;
        const response = await axios.delete(`http://image-srv:3000/api/image/deleting/${imageName}`);

        if (response.status !== 200) {
            throw new BadRequestError('Image not found to delete');
        }

        console.log('Event deleted successfully');
        await publishToExchanges('event_deleted', event._id);
        res.status(200).send({ message: 'Event deleted successfully' });

    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;
