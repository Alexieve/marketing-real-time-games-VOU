import express, { Request, Response, NextFunction } from 'express';
import { Event } from '../models/EventCommandModel';

const router = express.Router();

router.use(express.json());

router.get('/api/event_command/get_events/:brand', async (req: Request, res: Response) => {
    const { brand } = req.params;
    const events = await Event.find({ brand: brand });
    res.status(200).send(events);
});

export = router;
