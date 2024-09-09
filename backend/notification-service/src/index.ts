import express from 'express';
import {json} from 'body-parser';
import * as FirebaseService from "./FirebaseService";
import { RedisClient } from '@vmquynh-vou/shared';
import tokenRoutes from './routes/tokenRoute';
import pushNotificationRoutes from './routes/pushNotificationRoute';
import { CronJob } from 'cron';
import Expo from "expo-server-sdk";
import { NotFoundError } from './errors/not-found-error';
import { requestAPI } from '@vmquynh-vou/shared';


const axios = require('axios');
const cors = require('cors');


const app = express();


app.use(json());
app.use(cors());

app.use(tokenRoutes);

const expo = new Expo();

interface Event {
    name: string;
    startTime: string;
  }

new CronJob(
    "*/60 * * * * *",
    async function () {
      const userID = await RedisClient.get(`userOnDevice`);
      if (!userID) {
        return;
      }

      const token = await RedisClient.get(`deviceToken`);
      if (!token) {
        console.log('Device token not found');
        return;
      }

      const favEvents:Event[] = await requestAPI(
        `http://event-query-srv:3000/api/event_query/get_events_user_favorite/${userID}`, 
        'get', 
        {userID}
    );
      const UTC = new Date();
      const now = new Date(UTC.getTime() + 7 * 3600 * 1000);
      favEvents.forEach((event:Event) => {
        const eventStartTime = new Date(event.startTime);
        const timeDifference = eventStartTime.getTime() - now.getTime();
        if (timeDifference > 0 && timeDifference <= 86400000) {
            // console.log(`Event "${event.name}" is starting soon!`);
  
            // Send push notification
            expo.sendPushNotificationsAsync([
              {
                to: String(token),
                title: "Sự kiện sắp diễn ra",
                body: `Đừng bỏ lỡ: ${event.name}`,
              },
            ]);
          }
      });

    },
    null,
    true,
    "America/New_York"
  );


app.all('*', async (req, res, NextFunction) => {
    throw new NotFoundError();
});

RedisClient.getInstance();
app.listen(3000, () => {
    console.log('Notification service listening on port 3000');
})