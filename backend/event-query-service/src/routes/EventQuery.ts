import express, { Request, Response } from 'express';
import { Event } from '../models/EventQueryModel';

const router = express.Router();

router.use(express.json());

router.get('/api/event_query/get_events/:brand', async (req: Request, res: Response) => {
    const { brand } = req.params;
    // Find all events for the specified brand
    const events = await Event.find({ brand: brand });
    res.status(200).send(events);
});

export = router;
