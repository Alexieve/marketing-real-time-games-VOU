import express, { Request, Response } from 'express';
import { Event } from '../models/EventQueryModel';
import { EventVoucher } from '../models/EventVoucherQueryModel';
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
        res.status(200).send({});
        return;
    }
    // Take all event data of the favorited events
    const events = await Event.find({ _id: { $in: userEventFavorites.map(favorite => favorite.eventID) } });
    res.status(200).send(events);
});

router.get('/api/event_query/get_events_upcoming/', async (req: Request, res: Response) => {
    let UTC = new Date();
    let now = new Date(UTC.getTime() + 7 * 3600 * 1000);
    const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    // Find all upcoming events, startTime that more than current time 1 weeks
    const events = await Event.find({
        startTime: { $lte: oneWeek, $gte: now }
    });
    if (events.length === 0) {
        res.status(200).send({});
        return;
    }
    res.status(200).send(events);
});

router.get('/api/event_query/get_events_ongoing/', async (req: Request, res: Response) => {
    let UTC = new Date();
    let now = new Date(UTC.getTime() + 7 * 3600 * 1000);
    console.log(now);
    // Find all events that are currently ongoing
    const ongoingEvents = await Event.find({
        startTime: { $lte: now },
        endTime: { $gte: now }
    });

    if (ongoingEvents.length === 0) {
        res.status(200).send({});
        return;
    }

    res.status(200).send(ongoingEvents);
});

router.get('/api/event_query/search', async (req: Request, res: Response) => {
    const query = req.query.query as string;
    const events = await Event.find({ name: new RegExp(query, 'i') });

    if (events.length === 0) {
        res.status(200).send({});
        return;
    }
    res.status(200).send(events);
});

router.get('/api/event_query/get_event_detail_vouchers/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    // Find the event_vouchers for the specified event
    const eventVouchers = await EventVoucher.findById(id);
    if (!eventVouchers) {
        res.status(200).send({});
        return;
    }
    res.status(200).send(eventVouchers);
});

export = router;
