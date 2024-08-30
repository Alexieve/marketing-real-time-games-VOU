import { Event } from '../../models/EventQueryModel';
import { Voucher } from '../../models/VoucherQueryModel';
import { Game } from '../../models/GameQueryModel';

export const game_deleted = {
    exchange: 'game_deleted',
    callback: async (msg: any) => {
        try {
            if (msg) {
                const gameId = msg.content.toString();
                console.log("Received game_deleted:", gameId);
                const game = await Game.findByIdAndDelete(gameId);
                if (!game) {
                    console.error(`Game not found`);
                } else {
                    const gameName = game?.name;
                    const result = await Event.updateMany(
                        { 'games.name': gameName },
                        { $pull: { games: { name: gameName } } }
                    );
                    console.log("Game deleted");
                }
            }
        } catch (error) {
            console.error('Error processing game_deleted:', error);
        }
    },
}