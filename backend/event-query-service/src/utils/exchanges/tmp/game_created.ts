import { Event } from '../../../models/EventQueryModel';
import { Voucher } from '../../../models/VoucherQueryModel';
import { Game } from '../../../models/GameQueryModel';

export const game_created = {
    exchange: 'game_created',
    callback: async (msg: any) => {
        try {
            if (msg) {
                const game_msg = JSON.parse(msg.content.toString());
                console.log("Received game:", game_msg.gameID);
                const game = Game.build({
                    gameID: game_msg.gameID,
                    name: game_msg.name,
                    type: game_msg.type,
                    imageUrl: game_msg.imageUrl,
                    isExchange: game_msg.isExchange,
                    guide: game_msg.guide,
                });
                await game.save();
                console.log("Game saved");
            }
        } catch (error) {
            console.error('Error processing game_created:', error);
        }
    },
}