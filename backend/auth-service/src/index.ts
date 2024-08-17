import { app } from './app';
import { BrandCreatedPublisher } from './events/publishers/user-created-publisher';
import { rabbitMQWrapper } from './rabbitmq-wrapper';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    try {
        await rabbitMQWrapper.connect('amqp://rabbitmq');
        // rabbitMQWrapper.channel.on('close', () => {
        //     console.log('RabbitMQ channel closed');
        //     process.exit();
        // });
        // process.on('SIGINT', () => { rabbitMQWrapper.channel.close(); });
        // process.on('SIGTERM', () => { rabbitMQWrapper.channel.close(); });


    } catch (error) {
        console.error(error);
    }

    app.listen(3000, () => {
        console.log('Auth service listening on port 3000');
    });
}

start();