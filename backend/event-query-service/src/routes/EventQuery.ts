import express, { Request, Response, NextFunction } from 'express';
import { Event } from '../models/EventQueryModel';

const router = express.Router();

router.use(express.json());

router.get('/api/events_query/get_events', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.find({});
        res.status(200).send(events);
    }
    catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;
