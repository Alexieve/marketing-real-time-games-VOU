import amqplib, { Connection, Channel } from 'amqplib';

// Exchanges
import { event_created } from './exchanges/event_created';
import { event_updated } from './exchanges/event_updated';
import { event_deleted } from './exchanges/event_deleted';
import { voucher_created } from './exchanges/voucher_created';
import { voucher_deleted } from './exchanges/voucher_deleted';
import { voucher_updated } from './exchanges/voucher_updated';
import { game_created } from './exchanges/tmp/game_created';
import { game_deleted } from './exchanges/tmp/game_deleted';
import { game_updated } from './exchanges/tmp/game_updated';

let connection: Connection;
let channel: Channel;

const amqp_url_docker = 'amqp://rabbitmq:5672';

export const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(amqp_url_docker);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
}

type Subscription = {
    exchange: string;
    callback: (msg: amqplib.ConsumeMessage | null) => void;
};

async function subscribe(subscriptions: Subscription[]) {
    for (const subscription of subscriptions) {
        const { exchange, callback } = subscription;

        // Assert exchange
        await channel.assertExchange(exchange, 'fanout', { durable: true });

        // Assert queue
        const q = await channel.assertQueue('', { exclusive: true });

        // Bind queue to the exchange with the routing key s
        await channel.bindQueue(q.queue, exchange, '');

        // Consume messages
        channel.consume(q.queue, callback, { noAck: true });

        console.log(`Subscribed to exchange: ${exchange}`);
    }
}

export const subscribeToExchanges = async () => {
    await subscribe([
        event_created,
        event_updated,
        event_deleted,
        voucher_created,
        voucher_deleted,
        voucher_updated,
        game_created,
        game_deleted,
        game_updated
    ]);
};