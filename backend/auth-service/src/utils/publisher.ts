import { connect } from '@vmquynh-vou/shared';

export async function publish(exchange: string, routingKey: string, msg: any) {
    try {
        const connection = await connect();
        const channel = await connection.createChannel();
        await channel.assertExchange(exchange, 'fanout', { durable: true });

        channel.publish(exchange, routingKey, Buffer.from(msg));
        console.log(`[x] Sent ${msg} to exchange ${exchange} with routing key ${routingKey}`);
        
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Failed to publish message:', error);
    }
}
