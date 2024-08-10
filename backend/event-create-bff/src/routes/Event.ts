import express, { Request, Response } from 'express';
import { Event } from '../models/Event';

const router = express.Router();

router.use(express.json());

router.get('/api/events_query', async (req: Request, res: Response) => {
    const events = await Event.find({});
    res.status(200).send(events);
});

export = router;
