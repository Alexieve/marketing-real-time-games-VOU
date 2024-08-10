import express, { Request, Response } from 'express';
import { Event } from '../models/Event';
import { eventValidator } from '../utils/validators';
import { BadRequestError } from '../errors/bad-request-error';
import { publishMessage } from '../pubsub/producer';
const router = express.Router();

router.use(express.json());

router.post('/api/events/create', eventValidator, async (req: Request, res: Response) => {
    const { id, name, imageUrl, description, startTime, endTime } = req.body;

    const event = Event.build({
        id,
        name,
        imageUrl,
        description,
        startTime,
        endTime,
    });
    await event.save();
    await publishMessage('event_created_queue', event.toJSON());
    res.status(201).send(event);
});

router.put('/api/events/edit/:id', eventValidator, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, imageUrl, description, startTime, endTime } = req.body;

    const event = await Event.findByIdAndUpdate(id, {
        name,
        imageUrl,
        description,
        startTime,
        endTime,
    }, { new: true });

    if (!event) {
        throw new BadRequestError('Event not found');
    }

    res.status(200).send(event);
});

router.delete('/api/events/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const event = await Event.find({ id: id });
    if (!event) {
        throw new BadRequestError('Event not found');
    }

    res.status(200).send({ message: 'Event deleted successfully' });
});

router.get('/api/events/get', async (req: Request, res: Response) => {
    const events = await Event.find({});
    res.status(200).send(events);
});

export = router;
