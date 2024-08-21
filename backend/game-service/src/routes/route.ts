import express, {Request, Response} from 'express';
const fs = require("fs");
import { BadRequestError } from '@vmquynh-vou/shared';
import { gameInforValidator } from '../utils/validators';
const route = express.Router();

const gamesData = [
    {
      "id": 1,
      "name": "Realtime Quiz",
      "image": "quiz-image-url",
      "type": "Quiz",
      "allowItemTrade": false,
      "instructions": "Join the game at a specific time, answer questions correctly to win prizes."
    },
    {
      "id": 2,
      "name": "Lắc điện thoại",
      "image": "shake-phone-image-url",
      "type": "Random Rewards",
      "allowItemTrade": true,
      "instructions": "Shake your phone to get a random reward or combine items to exchange for a prize. Players can trade items with each other to combine them into a reward."
    }
];

route.get('/api/game/load-all', 
async (req: Request, res: Response) => {
    fs.readFile("games.json", "utf8", (err: any, data: string) => {
        if (err) {
            fs.writeFile("games.json", JSON.stringify(gamesData, null, 2), (err: any) => {
                if (err) {
                    throw new BadRequestError("Error reading file");
                }
                res.send(gamesData);
                return;
            });
        }
        // console.log("Load all games: ", JSON.parse(data));
        res.send(data);
    });
});

route.post('/api/game/update', gameInforValidator, 
async (req: Request, res: Response) => {
    const updatedGame = req.body;
    // console.log("Update game: ", updatedGame);

    fs.readFile("games.json", "utf8", (err: any, data: string) => {
        // if not exist, create new file
        if (err) {
            fs.writeFile("games.json", JSON.stringify([updatedGame], null, 2), (err: any) => {
                if (err) {
                    throw new BadRequestError("Error reading file");
                }
                res.send("Game updated successfully!");
            });
            return;
        }

        const games = JSON.parse(data);
        const gameIndex = games.findIndex((game: any) => game.name === updatedGame.name);
        if (gameIndex === -1) {
            games.push(updatedGame);
        } else {
            games[gameIndex] = updatedGame;
        }

        fs.writeFile("games.json", JSON.stringify(games, null, 2), (err: any) => {
            if (err) {
                throw new BadRequestError("Error reading file");
            }
            res.send("Game updated successfully!");
        });
    });
});

export {route as LoadRoute};
