import express, { Request, Response } from 'express';
import Expo from "expo-server-sdk";
import { RedisClient } from '@vmquynh-vou/shared';


const router = express.Router();

router.use(express.json());

const expo = new Expo();

router.post('/api/notification/pushNotification', async (req: Request, res: Response) => {
    // const deviceToken = "ExponentPushToken[Wzr0n9H3jotcoZnDIzI2OQ]";
    const cacheKey = `deviceToken`;
    const deviceToken = await RedisClient.get(cacheKey);
    
    // Ensure the deviceToken is a string and not null or object
    if (typeof deviceToken === 'string' && deviceToken !== null) {
      expo.sendPushNotificationsAsync([
        {
          to: deviceToken,
          title: "Sự kiện sắp diễn ra",
          body: "Đừng bỏ lỡ",
        },
      ]);
      res.status(200).send("Successfully pushed notification");
    } else {
      console.error("Invalid device token:", deviceToken);
      res.status(400);
      // Handle the case where deviceToken is null or not a string
    }
});



export = router;
