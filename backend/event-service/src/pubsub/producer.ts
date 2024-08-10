const amqblib = require('amqplib');
import { Event } from '../models/Event';

const amqp_url_docker = 'amqp://rabbitmq:rabbitmq@localhost:5672';

export const publishMessage = async (exchange: string, event_msg: Event) => {
    try {
        // Create a connection to the RabbitMQ server
        const conn = await amqblib.connect(amqp_url_docker);
        // Create a channel
        const channel = await conn.createChannel();
        // Declare a queue
        await channel.assertExchange(exchange, 'fanout', {
            durable: true
        });
        // Send a message to the queue
        await channel.publish(exchange, Buffer.from(JSON.stringify(event_msg)), {
            persistent: true,
        });
        // Close the connection
        setTimeout(() => {
            conn.close();
        }, 1000);

    } catch (error) {
        console.log(`Message publish to exchange ${exchange} failed: ${error}`);
    }
}
