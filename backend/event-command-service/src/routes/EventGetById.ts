import express, { Request, Response, NextFunction } from 'express';
import { Event } from '../models/EventCommandModel';
import { Voucher } from '../models/VoucherCommandModel';

const router = express.Router();

router.use(express.json());

router.get('/api/event_command/event_detail/:eventID', async (req: Request, res: Response) => {
    const { eventID } = req.params;
    // Find the event by eventID
    const event = await Event.findById(eventID);
    // Find vouchers of event
    const vouchers = await Voucher.find({ eventID: eventID });

    console.log(event?.startTime);
    // Attach vouchers to the event
    const payload = {
        event: event,
        vouchers: vouchers
    };
    res.status(200).send(payload);
});

export = router;
