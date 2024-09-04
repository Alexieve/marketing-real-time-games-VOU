import { Event } from '../../models/EventQueryModel';
import { Voucher } from '../../models/VoucherQueryModel';

export const event_created = {
    exchange: 'event_created',
    callback: async (msg: any) => {
        if (msg) {
            try {
                const event_msg = JSON.parse(msg.content.toString());
                console.log("Received event:", event_msg._id);
                //Take the vouchers data
                const vouchers = await Voucher.find({ _id: { $in: event_msg.vouchers } });
                if (vouchers.length !== event_msg.vouchers.length) {
                    throw new Error("Some vouchers not found");
                }
                //Take the games data
                // const games = await Game.find({ _id: { $in: event_msg.games } });
                // if (games.length !== event_msg.games.length) {
                //     throw new Error("Some games not found");
                // }
                // Create the event
                const event = Event.build({
                    _id: event_msg._id,
                    name: event_msg.name,
                    imageUrl: event_msg.imageUrl,
                    description: event_msg.description,
                    startTime: event_msg.startTime,
                    endTime: event_msg.endTime,
                    brand: event_msg.brand,
                    vouchers: vouchers,
                    gameID: event_msg.gameID,
                });
                await event.save();
                console.log("Event saved");
                //Update eventID in vouchers
                for (const voucher of vouchers) {
                    voucher.eventID = event_msg._id;
                    await voucher.save();
                }
            } catch (error) {
                console.error('Error processing event_created:', error);
            }
        }
    },
}