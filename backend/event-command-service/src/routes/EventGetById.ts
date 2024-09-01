import express, { Request, Response, NextFunction } from 'express';
import { Event } from '../models/EventCommandModel';
import { Voucher } from '../models/VoucherCommandModel';

const router = express.Router();

router.use(express.json());

router.get('/api/event_command/event_detail/:eventId', async (req: Request, res: Response) => {
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
});

export = router;
