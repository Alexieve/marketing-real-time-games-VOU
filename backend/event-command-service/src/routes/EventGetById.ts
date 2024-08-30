import express, { Request, Response, NextFunction } from 'express';
import { Event } from '../models/EventCommandModel';
import { Voucher } from '../models/VoucherCommandModel';

const router = express.Router();

router.use(express.json());

router.get('/api/event_command/event_detail/:eventId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { eventId } = req.params;
        // Find the event by eventId
        const event = await Event.findById(eventId);
        // Find vouchers of event
        const vouchers = await Voucher.find({ eventId: eventId });
        // Attach vouchers to the event
        const payload = {
            event: event,
            vouchers: vouchers
        };
        res.status(200).send(payload);
    }
    catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;
