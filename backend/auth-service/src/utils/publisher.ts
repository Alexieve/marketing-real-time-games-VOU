import * as amqp from 'amqplib';

export async function publish(exchange: string, exchangeService: string, routingKey: string, msg: any) {
    try {
        console.log('Connecting to RabbitMQ');
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        await channel.assertExchange(exchange, exchangeService, { durable: true });

        const msgBuffer = Buffer.from(JSON.stringify(msg));
        channel.publish(exchange, routingKey, msgBuffer);
        console.log(`[x] Sent ${JSON.stringify(msg)} to exchange ${exchange} with routing key ${routingKey}`);
        
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Failed to publish message:', error);
    }
}
