// await RedisClient.set('test', 'test', 30);
// console.log(await RedisClient.get('test'));

import express, {Request, Response} from 'express';
import { BadRequestError } from '@vmquynh-vou/shared';
import { PlayLog } from '../models/playlog';
import { EventGame } from '../models/event-game';
import { RedisClient } from '@vmquynh-vou/shared';
const route = express.Router();

route.get('/api/game/check-play-turn/:eventID/:customerID',
async (req: Request, res: Response) => {
    try {
        if (req.params.eventID && req.params.customerID) {
            const eventID = req.params.eventID as string;
            const customerID = parseInt(req.params.customerID)
            const cacheKey = `playlog:playTurn:${customerID}:${eventID}`;
            const cacheData = await RedisClient.get(cacheKey); // số lượt còn lại
            if (cacheData) { // nếu đang đang còn lượt chơi
                res.status(200).send(cacheData.toString());
            } else { // mới bắt đầu chơi
                const eventConfig = await EventGame.getEventGameByID(eventID);
                if (eventConfig) { // nếu có cấu hình game
                    const playTurn = eventConfig.playTurn || 0;
                    await RedisClient.set(cacheKey, playTurn.toString());
                    res.status(200).send(playTurn.toString());
                } else { // không có cấu hình game
                    throw new BadRequestError("Cannot loading event game without ID!");
                }
            }
            return;
        } else {
            throw new BadRequestError("Cannot loading playlog without ID!");
        }
    } catch (error: any) {
        throw new BadRequestError(error);
    }
});

route.put('/api/game/add-play-turn/:eventID/:customerID',
async (req: Request, res: Response) => {
    try {
        if (req.params.eventID && req.params.customerID) {
            const eventID = req.params.eventID as string;
            const customerID = parseInt(req.params.customerID);
            const cacheKey = `playlog:playTurn:${customerID}:${eventID}`;
            const cacheData = await RedisClient.get(cacheKey);
            if (cacheData) {
                const currentPlayTurn = parseInt(cacheData as string);
                await RedisClient.set(cacheKey, (currentPlayTurn + 1).toString());
            } else {
                throw new BadRequestError("Cannot adding to not exists play turn!");
            }
            
            res.send("Add play turn successfully!");
        } else {
            throw new BadRequestError("Cannot add play turn without ID!");
        }
    } catch (error: any) {
        throw new BadRequestError(error);
    }
});

route.get('/api/game/play-log/:eventID/:customerID', 
async (req: Request, res: Response) => {
    try {
        if (req.params.eventID && req.params.customerID) {
            const eventID = req.params.eventID as string;
            const customerID = parseInt(req.params.customerID)
            const playLog = await PlayLog.get({customerID, eventID, time: null});

            res.send(playLog);
        } else {
            throw new BadRequestError("Cannot loading playlog without ID!");
        }        
    } catch (error: any) {
        throw new BadRequestError(error);
    }
});

route.post('/api/game/play-log',
async (req: Request, res: Response) => {
    const {customerID, eventID} = req.body;
    console.log(req.body);
    try {
        await PlayLog.add({customerID, eventID, time: null});

        const cacheKey = `playlog:playTurn:${customerID}:${eventID}`;
        const cacheData = await RedisClient.get(cacheKey);
        if (cacheData) {
            const playTurn = parseInt(cacheData as string) - 1;
            await RedisClient.set(cacheKey, playTurn.toString());
        } else {
            throw new BadRequestError("Not enough play turn!");
        }

        res.send("Add play log successfully!");
    }
    catch (error: any) {
        throw new BadRequestError(error);
    }
});

export {route as PlayLogRoute};