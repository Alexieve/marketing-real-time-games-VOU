import { Event } from '../../models/EventQueryModel';
import { Voucher } from '../../models/VoucherQueryModel';
import { Game } from '../../models/GameQueryModel';

export const event_updated = {
    exchange: 'event_updated',
    callback: async (msg: any) => {
        if (msg) {
            try {
                const event_msg = JSON.parse(msg.content.toString());
                console.log("Received event_updated:", event_msg._id);
                //Take the vouchers data
                const vouchers = await Voucher.find({ _id: { $in: event_msg.vouchers } });
                if (vouchers.length !== event_msg.vouchers.length) {
                    console.error("Some vouchers not found");
                    throw new Error("Some vouchers not found");
                }
                //Take the games data
                const games = await Game.find({ _id: { $in: event_msg.games } });
                if (games.length !== event_msg.games.length) {
                    console.error("Some games not found");
                    throw new Error("Some games not found");
                }
                // Update the event
                const event = await Event.findByIdAndUpdate(event_msg._id, {
                    name: event_msg.name,
                    imageUrl: event_msg.imageUrl,
                    description: event_msg.description,
                    startTime: event_msg.startTime,
                    endTime: event_msg.endTime,
                    brand: event_msg.brand,
                    vouchers: vouchers,
                    games: games,
                }, { new: true });

                if (!event) {
                    throw new Error("Event not found");
                }
                console.log("Event updated");
                // Update eventId in vouchers
                for (const voucher of vouchers) {
                    voucher.eventId = event_msg._id;
                    await voucher.save();
                }
                // Update eventId in old vouchers which are not in the new vouchers list
                await Voucher.updateMany(
                    { eventId: event_msg._id, _id: { $nin: event_msg.vouchers } },
                    { eventId: null }
                );
            } catch (error) {
                console.error('Error processing event_updated:', error);
            }
        }
    },
}