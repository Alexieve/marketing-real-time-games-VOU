import express, {Request, Response} from 'express';
import { BadRequestError, requestAPI } from '@vmquynh-vou/shared';
import { gameInforValidator } from '../utils/validators';
const route = express.Router();

route.get('/api/game/load-all', 
async (req: Request, res: Response) => {
    try {
        const games = await requestAPI("http://event-query-srv:3000/api/events_query/get_games", "GET", []);
        console.log("Load all games: ", games);
        res.send(games);
    } catch (error) {
        throw new BadRequestError("Cannot loading games!");
    }
});

route.post('/api/game/update', gameInforValidator, 
async (req: Request, res: Response) => {
    const updatedGame = req.body;
    console.log("Update game: ", updatedGame);
});

export {route as LoadRoute};
