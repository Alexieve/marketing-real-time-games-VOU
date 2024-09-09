import express, { Request, Response } from 'express';
import { RedisClient } from '@vmquynh-vou/shared';
import Expo from "expo-server-sdk";


const router = express.Router();

router.use(express.json());

router.post('/api/notification/pushToken', async (req: Request, res: Response) => {
    const {userID, token} = req.body;
    // console.log(token);
    const cacheKey = `deviceToken`;
    await RedisClient.set(cacheKey, String(token));
    await RedisClient.set(`userOnDevice`, String(userID));
    // console.log(userID);
    // console.log(String(token));
    res.status(200).send();
});

router.post('/api/notification/deleteToken', async (req: Request, res: Response) => {
    const cacheKey = `deviceToken`;
    await RedisClient.delete(cacheKey);
    await RedisClient.delete(`userOnDevice`);

    res.status(200).send();
});


export = router;
