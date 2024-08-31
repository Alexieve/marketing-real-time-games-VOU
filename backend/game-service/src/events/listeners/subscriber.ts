import amqplib, { Connection, Channel } from 'amqplib';

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

// export const subscribeToExchanges = async () => {
//     await subscribe([
//         {
//             exchange: 'event_created',
//             callback: async (msg) => {
//                 if (msg) {
//                     try {
//                         const event_msg = JSON.parse(msg.content.toString());
//                         console.log("Received event:", event_msg._id);
//                         //Take the vouchers data
//                         const vouchers = await Voucher.find({ _id: { $in: event_msg.vouchers } });
//                         if (vouchers.length !== event_msg.vouchers.length) {
//                             throw new Error("Some vouchers not found");
//                         }
//                         //Take the games data
//                         const games = await Game.find({ _id: { $in: event_msg.games } });
//                         if (games.length !== event_msg.games.length) {
//                             throw new Error("Some games not found");
//                         }
//                         // Create the event
//                         const event = Event.build({
//                             _id: event_msg._id,
//                             name: event_msg.name,
//                             imageUrl: event_msg.imageUrl,
//                             description: event_msg.description,
//                             startTime: event_msg.startTime,
//                             endTime: event_msg.endTime,
//                             brand: event_msg.brand,
//                             vouchers: vouchers,
//                             games: games,
//                         });
//                         await event.save();
//                         console.log("Event saved");
//                         //Update eventId in vouchers
//                         for (const voucher of vouchers) {
//                             voucher.eventId = event_msg._id;
//                             await voucher.save();
//                         }
//                     } catch (error) {
//                         console.error('Error processing event_created:', error);
//                     }
//                 }
//             },
//         },
//         {
//             exchange: 'event_updated',
//             callback: async (msg) => {
//                 if (msg) {
//                     try {
//                         const event_msg = JSON.parse(msg.content.toString());
//                         console.log("Received event_updated:", event_msg._id);
//                         //Take the vouchers data
//                         const vouchers = await Voucher.find({ _id: { $in: event_msg.vouchers } });
//                         if (vouchers.length !== event_msg.vouchers.length) {
//                             console.error("Some vouchers not found");
//                             throw new Error("Some vouchers not found");
//                         }
//                         //Take the games data
//                         const games = await Game.find({ _id: { $in: event_msg.games } });
//                         if (games.length !== event_msg.games.length) {
//                             console.error("Some games not found");
//                             throw new Error("Some games not found");
//                         }
//                         // Update the event
//                         const event = await Event.findByIdAndUpdate(event_msg._id, {
//                             name: event_msg.name,
//                             imageUrl: event_msg.imageUrl,
//                             description: event_msg.description,
//                             startTime: event_msg.startTime,
//                             endTime: event_msg.endTime,
//                             brand: event_msg.brand,
//                             vouchers: vouchers,
//                             games: games,
//                         }, { new: true });

//                         if (!event) {
//                             throw new Error("Event not found");
//                         }
//                         console.log("Event updated");
//                         // Update eventId in vouchers
//                         for (const voucher of vouchers) {
//                             voucher.eventId = event_msg._id;
//                             await voucher.save();
//                         }
//                         // Update eventId in old vouchers which are not in the new vouchers list
//                         await Voucher.updateMany(
//                             { eventId: event_msg._id, _id: { $nin: event_msg.vouchers } },
//                             { eventId: null }
//                         );
//                     } catch (error) {
//                         console.error('Error processing event_updated:', error);
//                     }
//                 }
//             },
//         },
//         {
//             exchange: 'event_deleted',
//             callback: async (msg) => {
//                 if (msg) {
//                     try {
//                         const eventId = msg.content.toString();
//                         console.log("Received event_deleted:", eventId);
//                         //Find the event
//                         const event = await Event.findByIdAndDelete(eventId);
//                         if (!event) {
//                             throw new Error("Event not found");
//                         }
//                         //Delete the eventId in vouchers
//                         const result = await Voucher.updateMany(
//                             { eventId: eventId },
//                             { eventId: null }
//                         );
//                         if (!result) {
//                             throw new Error("Vouchers not found");
//                         }
//                         console.log("Event deleted");

//                     } catch (error) {
//                         console.error('Error processing event_deleted:', error);
//                     }
//                 }
//             },
//         },
//         {
//             exchange: 'voucher_created',
//             callback: async (msg) => {
//                 try {
//                     if (msg) {
//                         const voucher_msg = JSON.parse(msg.content.toString());
//                         console.log("Received voucher:", voucher_msg._id);
//                         const voucher = Voucher.build({
//                             _id: voucher_msg._id,
//                             code: voucher_msg.code,
//                             qrCodeUrl: voucher_msg.qrCodeUrl,
//                             imageUrl: voucher_msg.imageUrl,
//                             price: voucher_msg.price,
//                             description: voucher_msg.description,
//                             quantity: voucher_msg.quantity,
//                             expTime: voucher_msg.expTime,
//                             status: voucher_msg.status,
//                             brand: voucher_msg.brand,
//                             eventId: voucher_msg.eventId
//                         });
//                         await voucher.save();
//                         console.log("Voucher saved");
//                     }
//                 } catch (error) {
//                     console.error('Error processing voucher_created:', error);
//                 }
//             },
//         },
//         {
//             exchange: 'voucher_deleted',
//             callback: async (msg) => {
//                 if (msg) {
//                     try {
//                         const voucherId = msg.content.toString();
//                         console.log("Received voucher_deleted:", voucherId);
//                         const voucher = await Voucher.findByIdAndDelete(voucherId);
//                         if (!voucher)
//                             throw new Error("Voucher not found");
//                         // Remove the voucher from the event
//                         if (voucher.eventId !== null) {
//                             const event = await Event.findByIdAndUpdate(voucher.eventId, { $pull: { vouchers: { _id: voucherId } } });
//                             if (!event) {
//                                 throw new Error("Event not found");
//                             }
//                             await event.save();
//                             console.log("Voucher removed from the event");
//                         }
//                         console.log("Voucher deleted");
//                     }
//                     catch (error) {
//                         console.error('Error processing voucher_deleted:', error);
//                     }
//                 }
//             }
//         },
//         {
//             exchange: 'voucher_updated',
//             callback: async (msg) => {
//                 if (msg) {
//                     try {
//                         const voucher_msg = JSON.parse(msg.content.toString());
//                         console.log("Received voucher_updated:", voucher_msg._id);
//                         const voucher = await Voucher.findById(voucher_msg._id);
//                         if (!voucher) {
//                             throw new Error("Voucher not found");
//                         }
//                         voucher.set({
//                             code: voucher_msg.code,
//                             qrCodeUrl: voucher_msg.qrCodeUrl,
//                             imageUrl: voucher_msg.imageUrl,
//                             price: voucher_msg.price,
//                             description: voucher_msg.description,
//                             quantity: voucher_msg.quantity,
//                             expTime: voucher_msg.expTime,
//                             status: voucher_msg.status,
//                             brand: voucher_msg.brand,
//                         });
//                         await voucher.save();
//                         // Update the voucher data in the event
//                         if (voucher.eventId !== null) {
//                             const result = await Event.updateOne(
//                                 {
//                                     '_id': voucher.eventId,
//                                     'vouchers._id': voucher._id
//                                 },
//                                 {
//                                     $set: {
//                                         'vouchers.$.code': voucher_msg.code,
//                                         'vouchers.$.qrCodeUrl': voucher_msg.qrCodeUrl,
//                                         'vouchers.$.imageUrl': voucher_msg.imageUrl,
//                                         'vouchers.$.price': voucher_msg.price,
//                                         'vouchers.$.description': voucher_msg.description,
//                                         'vouchers.$.quantity': voucher_msg.quantity,
//                                         'vouchers.$.expTime': voucher_msg.expTime,
//                                         'vouchers.$.status': voucher_msg.status,
//                                         'vouchers.$.brand': voucher_msg.brand,
//                                     },
//                                 }
//                             );
//                             if (!result) {
//                                 throw new Error("Voucher not found in event");
//                             }
//                         }
//                         console.log("Voucher updated");
//                     }
//                     catch (error) {
//                         console.error('Error processing voucher_updated:', error);
//                     }
//                 }
//             },
//         },
//         {
//             exchange: 'game_created',
//             callback: async (msg) => {
//                 try {
//                     if (msg) {
//                         const game_msg = JSON.parse(msg.content.toString());
//                         console.log("Received game:", game_msg._id);
//                         const game = Game.build({
//                             _id: game_msg._id,
//                             name: game_msg.name,
//                             type: game_msg.type,
//                             imageUrl: game_msg.imageUrl,
//                             isExchange: game_msg.isExchange,
//                             guide: game_msg.guide,
//                         });
//                         await game.save();
//                         console.log("Game saved");
//                     }
//                 } catch (error) {
//                     console.error('Error processing game_created:', error);
//                 }
//             },
//         },
//         {
//             exchange: 'game_deleted',
//             callback: async (msg) => {
//                 try {
//                     if (msg) {
//                         const gameId = msg.content.toString();
//                         console.log("Received game_deleted:", gameId);
//                         const game = await Game.findByIdAndDelete(gameId);
//                         if (!game) {
//                             console.error(`Game not found`);
//                         } else {
//                             const gameName = game?.name;
//                             const result = await Event.updateMany(
//                                 { 'games.name': gameName },
//                                 { $pull: { games: { name: gameName } } }
//                             );
//                             console.log("Game deleted");
//                         }
//                     }
//                 } catch (error) {
//                     console.error('Error processing game_deleted:', error);
//                 }
//             },
//         },
//         {
//             exchange: 'game_updated',
//             callback: async (msg) => {
//                 try {
//                     if (msg) {
//                         const game_msg = JSON.parse(msg.content.toString());
//                         console.log("Received game_updated:", game_msg._id);
//                         const game = await Game.findById(game_msg._id);
//                         if (game) {
//                             game.set({
//                                 name: game_msg.name,
//                                 type: game_msg.type,
//                                 imageUrl: game_msg.imageUrl,
//                                 isExchange: game_msg.isExchange,
//                                 guide: game_msg.guide,
//                             });
//                             await game.save();
//                             // Update the game data in the events
//                             const result = await Event.updateMany(
//                                 { 'games.name': game_msg.name },
//                                 {
//                                     $set: {
//                                         'games.$.type': game_msg.type,
//                                         'games.$.imageUrl': game_msg.imageUrl,
//                                         'games.$.isExchange': game_msg.isExchange,
//                                         'games.$.guide': game_msg.guide,
//                                     }
//                                 }
//                             );
//                             if (!result) {
//                                 console.error(`Game not found in events`);
//                             } else {
//                                 console.log("Game updated");
//                             }
//                         } else {
//                             console.error(`Game not found`);
//                         }
//                     }
//                 } catch (error) {
//                     console.error('Error processing game_updated:', error);
//                 }
//             },
//         },
//     ]);
// };