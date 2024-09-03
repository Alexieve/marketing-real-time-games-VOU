import express, { Request, Response } from 'express';
import { Event } from '../models/EventQueryModel';
import { UserEventFavorite } from '../models/UserEventFavoriteQueryModel';

const router = express.Router();

router.use(express.json());

router.get('/api/event_query/get_events/:brand', async (req: Request, res: Response) => {
    const { brand } = req.params;
    // Find all events for the specified brand
    const events = await Event.find({ brand: brand });
    res.status(200).send(events);
});

router.post('/api/event_query/add_events_user_favorite/', async (req: Request, res: Response) => {
    const { userID, eventID } = req.body;
    // Checking whether the user has already favorited the event
    const userEventFavorite = await UserEventFavorite.findOne({ userID: userID, eventID: eventID });
    if (userEventFavorite) {
        await userEventFavorite.deleteOne();
        res.status(200).send({ message: 'Event unfavorited' });
    }
    else {
        const newUserEventFavorite = UserEventFavorite.build({ userID: userID, eventID: eventID });
        await newUserEventFavorite.save();
        res.status(201).send({ message: 'Event favorited' });
    }
});

router.get('/api/event_query/get_events_user_favorite/:userID', async (req: Request, res: Response) => {
    const { userID } = req.params;
    // Find all events favorited by the specified user
    const userEventFavorites = await UserEventFavorite.find({ userID: userID });

    if (userEventFavorites.length === 0) {
        res.status(200).send({ message: 'No favorited events' });
    }
    // Take all event data of the favorited events
    const events = await Event.find({ _id: { $in: userEventFavorites.map(favorite => favorite.eventID) } });
    res.status(200).send(events);
});

router.get('/api/event_query/get_events_upcoming/', async (req: Request, res: Response) => {
    // Find all upcoming events, startTime that less than current time 1 weeks
    const events = await Event.find({ startTime: { $lte: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) } });
    if (events.length === 0) {
        res.status(200).send({ message: 'No upcoming events' });
    }
    res.status(200).send(events);
});

export = router;
