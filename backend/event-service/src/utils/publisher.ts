import amqplib, { Connection, Channel } from 'amqplib';

const amqp_url_docker = 'amqp://rabbitmq-srv:5672';

let conn: Connection;
let channel: Channel;

export const connectRabbitMQ = async () => {
    try {
        conn = await amqplib.connect(amqp_url_docker);
        channel = await conn.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
}

export const publishToExchanges = async (exchange: string, msg_object: any) => {
    try {
        // Declare a queue
        await channel.assertExchange(exchange, 'fanout', {
            durable: true
        });
        // Send a message to the queue
        channel.publish(exchange, '', Buffer.from(msg_object), {
            persistent: false,
        });
        console.log("Message published to exchange:", exchange);

    } catch (error) {
        console.log(`Message publish to exchange ${exchange} failed: ${error}`);
    }
}
