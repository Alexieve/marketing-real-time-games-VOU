import express, { Request, Response } from 'express';
import { Game } from '../models/GameQueryModel';

const router = express.Router();

router.use(express.json());

router.get('/api/event_query/get_games', async (req: Request, res: Response) => {
    const games = await Game.find({});
    res.status(200).send(games);
});

export = router;
