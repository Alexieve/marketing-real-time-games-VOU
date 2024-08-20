import { app } from './app';
import { BrandCreatedPublisher } from './events/publishers/user-created-publisher';
import { rabbitMQWrapper } from '@vmquynh-vou/shared';
import { RedisClient } from '@vmquynh-vou/shared';
// const RedisClient = require('@vmquynh-vou/shared');

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    try {
        await rabbitMQWrapper.connect('amqp://rabbitmq');
    } catch (error) {
        console.error(error);
    }

    // await RedisClient.getInstance();
    // await RedisClient.set('test', 'test', 30);
    // console.log(await RedisClient.get('test'));

    app.listen(3000, () => {
        console.log('Auth service listening on port 3000');
    });
}

start();