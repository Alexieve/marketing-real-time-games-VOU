import express, { Request, Response } from 'express';
import { BadRequestError, requestAPI } from '@vmquynh-vou/shared';
import { gameInforValidator } from '../utils/validators';
import { Game } from '../models/game';
const route = express.Router();

route.get('/api/game/game-config/:gameID', 
async (req: Request, res: Response) => {
    try {
        if (req.params.gameID !== ':gameID') {
            const gameID = parseInt(req.params.gameID as string);
            const game = await Game.getGameByID(gameID);
            res.send(game);
        } else {
            const games = await Game.getAllGames();
            res.send(games);
        }        
    } catch (error) {
        throw new BadRequestError("Cannot loading games!");
    }
});

route.put('/api/game/game-config', gameInforValidator,
    async (req: Request, res: Response) => {
        const updatedGame = req.body;
        try {
            await Game.update(updatedGame);
            const games = await Game.getGameByID(updatedGame.gameID);
            res.send(games);
        }
        catch (error) {
            throw new BadRequestError("Cannot updating game!");
        }

        console.log("Update game: ", updatedGame);
    });

export { route as GameRoute };
