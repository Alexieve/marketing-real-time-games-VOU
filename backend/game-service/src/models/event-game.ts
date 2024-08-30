import db from '../connection';
import { Game, IGame } from './game';

interface IEventGame extends IGame {
    eventID: string | null;
    playTurn: number | null;
}

class EventGame extends Game {
    eventID: string | null;
    playTurn: number | null;

    constructor({eventID, gameID, playTurn, name, type, imageURL, isExchange, guide}: IEventGame) {
        super({gameID, name, type, imageURL, isExchange, guide});
        this.eventID = eventID || null;
        this.playTurn = playTurn || 1;
    }

    static async getEventGameByID(eventID: string): Promise<EventGame | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_GET_EVENTGAME_BY_ID($1)',
                [eventID]
            );
            if (res.rows.length === 0) return null;

            return Game.getGameByID(res.rows[0].gameid).then((game) => {
                if (game) {
                    const eventGame = new EventGame({
                        eventID: res.rows[0].eventid,
                        gameID: res.rows[0].gameid,
                        playTurn: res.rows[0].playturn,
                        name: game.name,
                        type: game.type,
                        imageURL: game.imageURL,
                        isExchange: game.isExchange,
                        guide: game.guide,
                    });
                    return eventGame;
                } else {
                    return null;
                }
            });
        } catch (err) {
            console.error('Error getting all games:', err);
            return null;
        }
    }

    static async add({eventID, gameID, playTurn}: IEventGame): Promise<void> {
        try {
            await db.query(
                'CALL SP_ADD_EVENTGAMECONFIG($1, $2, $3)',
                [eventID, gameID, playTurn]
            );
        } catch (error) {
            console.error('Error adding event game:', error);
            throw error;
        }
    }

    static async update({ eventID, gameID, playTurn }: IEventGame): Promise<void> {
        if (!eventID) throw new Error('Cannot updating event game without ID');
        try {
            await db.query(
                'CALL SP_UPDATE_EVENTGAMECONFIG($1, $2, $3)', 
                [eventID, gameID, playTurn]
            );
        } catch (error) {
            console.error('Error updating game:', error);
            throw error;   
        }
    }

    // async getGameItems(): Promise<GameItem[] | null> {
    //     if (!this.GameID) throw new Error('Cannot get game items without ID');

    //     try {
    //         const res = await db.query(
    //             'SELECT * FROM FUNC_GET_ALL_ITEMS_OF_GAME($1)',
    //             [this.GameID]
    //         );            
    //         if (res.rows.length === 0) return null;
    //         const gameItems = res.rows.map((row: any) => new GameItem({
    //             ItemID: row.ItemID,
    //             GameID: row.GameID,
    //             Name: row.Name,
    //             ImageURL: row.ImageURL,
    //             Description: row.Description
    //         }));
            
    //         return gameItems;
    //     } catch (err) {
    //         console.error('Error getting all game items:', err);
    //         return null;
    //     }
    // }

    // async getGameItemByID(ItemID: number): Promise<GameItem | null> {
    //     if (!this.GameID) throw new Error('Cannot get game item without ID');

    //     try {
    //         const res = await db.query(
    //             'SELECT * FROM FUNC_GET_ITEM_OF_GAME_BY_ITEMID($1, $2)',
    //             [this.GameID, ItemID]
    //         );
    //         if (res.rows.length === 0) return null;
    //         return new GameItem(res.rows[0]);
    //     } catch (error) {
    //         console.error('Error getting game item by id:', error);
    //         throw error;
    //     }
    // }
}    
export { EventGame, IEventGame };
