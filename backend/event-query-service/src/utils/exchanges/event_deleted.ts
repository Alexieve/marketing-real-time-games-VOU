import { Event } from '../../models/EventQueryModel';
import { EventVoucher } from '../../models/EventVoucherQueryModel';
import { Voucher } from '../../models/VoucherQueryModel';

export const event_deleted = {
    exchange: 'event_deleted',
    callback: async (msg: any) => {
        if (msg) {
            try {
                const eventID = msg.content.toString();
                console.log("Received event_deleted:", eventID);
                //Find the event
                const event = await Event.findByIdAndDelete(eventID);
                if (!event) {
                    throw new Error("Event not found");
                }
                // Delete the event_voucher
                const event_voucher = await EventVoucher.findByIdAndDelete(eventID);
                if (!event_voucher) {
                    throw new Error("Event voucher not found");
                }
                //Delete the eventID in vouchers
                const result = await Voucher.updateMany(
                    { eventID: eventID },
                    { eventID: null }
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