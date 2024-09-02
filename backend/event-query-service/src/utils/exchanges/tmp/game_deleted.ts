import { Event } from '../../../models/EventQueryModel';
import { Voucher } from '../../../models/VoucherQueryModel';
import { Game } from '../../../models/GameQueryModel';

export const game_deleted = {
    exchange: 'game_deleted',
    callback: async (msg: any) => {
        try {
            if (msg) {
                const gameID = msg.content.toString();
                console.log("Received game_deleted:", gameID);
                const game = await Game.findOneAndDelete({ gameID: gameID });
                if (!game) {
                    console.error(`Game not found`);
                } else {
                    await Event.updateMany({ gameID: gameID }, { gameID: null });
                    console.log("Game deleted");
                }
            }
        } catch (error) {
            console.error('Error processing game_deleted:', error);
        }
    },
}