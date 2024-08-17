import amqp, { Channel, Connection } from 'amqplib';

class RabbitMQWrapper {
  private _connection?: Connection;
  private _channel?: Channel;

  get connection() {
    if (!this._connection) {
      throw new Error('Cannot access RabbitMQ connection before connecting');
      // console.log('Cannot access RabbitMQ connection before connecting');
      // return null;
    }
    return this._connection;
  }

  get channel() {
    if (!this._channel) {
      throw new Error('Cannot access RabbitMQ channel before connecting');
      // console.log('Cannot access RabbitMQ channel before connecting');
      // return null;
    }
    return this._channel;
  }

  

  async connect(url: string): Promise<any> {
    try {
      this._connection = await amqp.connect(url);
      this._channel = await this._connection.createChannel();

      return new Promise<void>((resolve, reject) => {
        if (this._connection && this._channel) {
          console.log('Connected to RabbitMQ');
          resolve();
        } else {
          reject(new Error('Failed to create RabbitMQ'));
        }
      });
    } catch (error) {
      setTimeout(() => this.connect(url), 1000);
    }
  }
}

export const rabbitMQWrapper = new RabbitMQWrapper();
