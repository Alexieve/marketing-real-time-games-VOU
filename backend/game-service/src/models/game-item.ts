import db from '../connection';

import { Password } from '@vmquynh-vou/shared';

interface IGameItem {
    itemID?: number | null;
    gameID: number | null;
    name: string | null;
    imageURL: string | null;
    description: string | null;
}


class GameItem implements IGameItem {
    itemID: number | null;
    gameID: number | null;
    name: string | null;
    imageURL: string | null;
    description: string | null;

    constructor({itemID, gameID, name, imageURL, description}: IGameItem) {
        this.itemID = itemID || null;
        this.gameID = gameID;
        this.name = name;
        this.imageURL = imageURL;
        this.description = description;
    }

    static async getGameItems(eventID: string): Promise<GameItem[] | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_GET_ALL_ITEMS_OF_GAME($1)',
                [eventID]
            );            
            if (res.rows.length === 0) return null;
            const gameItems = res.rows.map((row: any) => new GameItem({
                itemID: row.itemid,
                gameID: row.gameid,
                name: row.name,
                imageURL: row.imageurl,
                description: row.description
            }));
            
            return gameItems;
        } catch (err) {
            console.error('Error getting all game items:', err);
            return null;
        }
    }

    static async getGameItem_By_ItemID(itemID: number): Promise<GameItem | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_GET_ITEM_OF_GAME_BY_ITEMID($1)',
                [itemID]
            );
            if (res.rows.length === 0) return null;
            return new GameItem(res.rows[0]);
        } catch (error) {
            console.error('Error getting game item by id:', error);
            throw error;
        }
    }
}    
export { GameItem, IGameItem };
