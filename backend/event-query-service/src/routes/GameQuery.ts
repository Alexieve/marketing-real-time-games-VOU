import express, { Request, Response, NextFunction } from 'express';
import { Game } from '../models/GameQueryModel';

const router = express.Router();

router.use(express.json());

router.get('/api/events_query/get_games', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const games = await Game.find({});
        res.status(200).send(games);
    }
    catch (error) {
        console.log(error);
        next(error); // Pass the error to the error-handling middleware
    }
});

export = router;
