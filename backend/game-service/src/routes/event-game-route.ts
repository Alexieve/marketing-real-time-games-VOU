import express, {Request, Response} from 'express';
import { BadRequestError } from '@vmquynh-vou/shared';
import { EventGame } from '../models/event-game';
import { RedisClient } from '@vmquynh-vou/shared';
const route = express.Router();

route.get('/api/game/event-game-config/:eventID', 
async (req: Request, res: Response) => {
    try {
        if (req.params.eventID) {
            const eventID = req.params.eventID as string;

            const cacheKey = `event-game-config:${eventID}`;
            const cacheData = await RedisClient.get(cacheKey);
            if (cacheData) {
                res.send(cacheData);
                return;
            }

            const event = await EventGame.getEventGameByID(eventID);

            await RedisClient.set(cacheKey, JSON.stringify(event), 60);
            res.send(event);
        } else {
            throw new BadRequestError("Cannot loading event game without ID!");
        }        
    } catch (error: any) {
        throw new BadRequestError(error);
    }
});

route.post('/api/game/event-game-config',
async (req: Request, res: Response) => {
    const eventConfig = req.body;
    try {
        await EventGame.add(eventConfig);
        res.send("Add event game successfully!");
    }
    catch (error: any) {
        throw new BadRequestError(error);
    }
});

route.put('/api/game/event-game-config',
async (req: Request, res: Response) => {
    const updatedEvent = req.body;
    try {
        await RedisClient.delete(`event-game-config:${updatedEvent.eventID}`);

        await EventGame.update(updatedEvent);
        res.send("Update event game successfully!");
    }
    catch (error: any) {
        throw new BadRequestError(error);
    }
})

export {route as EventGameRoute};
