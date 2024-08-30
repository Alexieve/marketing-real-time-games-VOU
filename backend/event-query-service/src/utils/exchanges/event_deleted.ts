import { Event } from '../../models/EventQueryModel';
import { Voucher } from '../../models/VoucherQueryModel';
import { Game } from '../../models/GameQueryModel';

export const event_deleted = {
    exchange: 'event_deleted',
    callback: async (msg: any) => {
        if (msg) {
            try {
                const eventId = msg.content.toString();
                console.log("Received event_deleted:", eventId);
                //Find the event
                const event = await Event.findByIdAndDelete(eventId);
                if (!event) {
                    throw new Error("Event not found");
                }
                //Delete the eventId in vouchers
                const result = await Voucher.updateMany(
                    { eventId: eventId },
                    { eventId: null }
                );
                if (!result) {
                    throw new Error("Vouchers not found");
                }
                console.log("Event deleted");

            } catch (error) {
                console.error('Error processing event_deleted:', error);
            }
        }
    },
}