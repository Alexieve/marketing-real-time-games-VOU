import { Event } from '../../models/EventQueryModel';
import { Voucher } from '../../models/VoucherQueryModel';
import { Game } from '../../models/GameQueryModel';

export const game_updated = {
    exchange: 'game_updated',
    callback: async (msg: any) => {
        try {
            if (msg) {
                const game_msg = JSON.parse(msg.content.toString());
                console.log("Received game_updated:", game_msg._id);
                const game = await Game.findById(game_msg._id);
                if (game) {
                    game.set({
                        name: game_msg.name,
                        type: game_msg.type,
                        imageUrl: game_msg.imageUrl,
                        isExchange: game_msg.isExchange,
                        guide: game_msg.guide,
                    });
                    await game.save();
                    // Update the game data in the events
                    const result = await Event.updateMany(
                        { 'games.name': game_msg.name },
                        {
                            $set: {
                                'games.$.type': game_msg.type,
                                'games.$.imageUrl': game_msg.imageUrl,
                                'games.$.isExchange': game_msg.isExchange,
                                'games.$.guide': game_msg.guide,
                            }
                        }
                    );
                    if (!result) {
                        console.error(`Game not found in events`);
                    } else {
                        console.log("Game updated");
                    }
                } else {
                    console.error(`Game not found`);
                }
            }
        } catch (error) {
            console.error('Error processing game_updated:', error);
        }
    },
}