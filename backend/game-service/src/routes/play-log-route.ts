// await RedisClient.set('test', 'test', 30);
// console.log(await RedisClient.get('test'));

import express, {Request, Response} from 'express';
import { requestAPI } from '@vmquynh-vou/shared';
import { BadRequestError } from '@vmquynh-vou/shared';
import { PlayLog } from '../models/playlog';
import { EventGame } from '../models/event-game';
import { RedisClient } from '@vmquynh-vou/shared';
const route = express.Router();

route.get('/api/game/check-play-turn/:eventID/:customerID', // Check play turn
async (req: Request, res: Response) => {
    try {
        if (req.params.eventID && req.params.customerID) {
            const eventID = req.params.eventID as string;
            const customerID = parseInt(req.params.customerID)
            const cacheKey = `playlog:playTurn:${customerID}:${eventID}`;
            const cacheData = await RedisClient.get(cacheKey); // số lượt còn lại
            if (cacheData || cacheData?.toString() === "0") { // nếu đang đang còn lượt chơi
                console.log("cacheData: ", cacheData);
                res.status(200).send(cacheData.toString());
            } else { // mới bắt đầu chơi
                const eventConfig = await EventGame.getEventGameByID(eventID);
                console.log("eventConfig: ", eventConfig);
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

route.put('/api/game/add-play-turn/:eventID/:customerID/:phonenum', // Add play turn
async (req: Request, res: Response) => {
    try {
        if (req.params.eventID && req.params.customerID && req.params.phonenum) {
            const eventID = req.params.eventID as string;
            const customerID = parseInt(req.params.customerID);
            const phonenum = req.params.phonenum;

            let friend = null;
            try {
                friend = await requestAPI(
                    `http://user-srv:3000/api/user-management/load/by-phonenum/${phonenum}`,
                    'GET',
                    null
                );
            } catch (error) {
                throw ("Friend not found!");
            }

            let cacheKey = `playlog:AddPlayTurn:${customerID}:${eventID}`;
            let cacheData = await RedisClient.get(cacheKey);
            if (cacheData) {
                const giftTurn = parseInt(cacheData as string);
                if (giftTurn >= 3) {
                    throw ("Not enough gift turn!");
                } else {
                    await RedisClient.set(cacheKey, (giftTurn + 1).toString(), 100);
                }
            } else {
                await RedisClient.set(cacheKey, "1", 100);
            }

            

            cacheKey = `playlog:playTurn:${friend.id}:${eventID}`;
            cacheData = await RedisClient.get(cacheKey);
            if (cacheData) {
                const currentPlayTurn = parseInt(cacheData as string);
                await RedisClient.set(cacheKey, (currentPlayTurn + 1).toString());
            } else {
                await RedisClient.set(cacheKey, "1");
            }
            
            res.send("Add play turn successfully!");
        } else {
            throw new BadRequestError("Cannot add play turn without ID!");
        }
    } catch (error: any) {
        throw new BadRequestError(error);
    }
});

route.get('/api/game/play-log/:eventID/:customerID', // Get play log
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

route.post('/api/game/play-log', // Add playlog and decrease play turn
async (req: Request, res: Response) => {
    const {customerID, eventID} = req.body;
    try {
        const cacheKey = `playlog:playTurn:${customerID}:${eventID}`;
        const cacheData = await RedisClient.get(cacheKey);
        if (cacheData && parseInt(cacheData as string) > 0) {
            console.log("cacheData: ", cacheData);
            const playTurn = parseInt(cacheData as string) - 1;
            console.log("playturn: ", playTurn);
            await RedisClient.set(cacheKey, playTurn.toString());
            await PlayLog.add({customerID, eventID, time: null});
            res.send("Add play log successfully!");
        } else {
            throw ("Not enough play turn!");
        }
    }
    catch (error: any) {
        throw new BadRequestError(error);
    }
});

export {route as PlayLogRoute};