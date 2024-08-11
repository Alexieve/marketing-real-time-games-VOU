import * as amqp from 'amqplib';

async function connect() : Promise<amqp.Connection> {
  while (true) {
    try {
      const connection = await amqp.connect("amqp://rabbitmq");
      if (connection) {
        return connection;
      }
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

async function process(msg: any) {
  const { action, data } = JSON.parse(msg);
  if (action === 'create') {
      console.log(`[x] Received create user request: ${data}`);
  }
}

export async function consume(exchange: string, exchangeService: string, queue: string,  routingKey: string) {
  try {
    console.log('Connecting to RabbitMQ');
    const connection = await connect();
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, exchangeService, { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, (msg : any) => {
      if (msg !== null) {
        const content = msg.content.toString();
        process(content);
        console.log(`[x] Received ${content}`);

        channel.ack(msg);
      }
    }, { noAck: false });
  } catch (error) {
    console.error('Failed to consume messages:', error);
  }
}
