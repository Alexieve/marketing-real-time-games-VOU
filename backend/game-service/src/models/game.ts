import db from '../connection';

interface IGame {
    gameID?: number | null;
    name: string | null;
    type: string | null;
    imageURL: string | null | null;
    isExchange: boolean | null;
    guide: string | null;
}


class Game implements IGame {
    gameID: number | null;
    name: string | null;
    type: string | null;
    imageURL: string | null;
    isExchange: boolean | null;
    guide: string | null;

    constructor({
        gameID=null, 
        name=null, 
        type=null, 
        imageURL=null, 
        isExchange=null, 
        guide=null
    }: IGame) {
        this.gameID = gameID;
        this.name = name;
        this.type = type;
        this.imageURL = imageURL;
        this.isExchange = isExchange;
        this.guide = guide;
    }

    static async getAllGames(): Promise<Game[] | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_GET_ALL_GAMES()'
            );            
            if (res.rows.length === 0) return null;
            const games = res.rows.map((row: any) => new Game({
                gameID: row.gameid,
                name: row.name,
                type: row.type,
                imageURL: row.imageurl,
                isExchange: row.isexchange,
                guide: row.guide
            }));
            
            return games;
        } catch (err) {
            console.error('Error getting all games:', err);
            return null;
        }
    }

    static async getGameByID(GameID: number): Promise<Game | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_GET_GAME_BY_ID($1)',
                [GameID]
            );
            if (res.rows.length === 0) return null;
            const game = new Game({
                gameID: res.rows[0].gameid,
                name: res.rows[0].name,
                type: res.rows[0].type,
                imageURL: res.rows[0].imageurl,
                isExchange: res.rows[0].isexchange,
                guide: res.rows[0].guide
            });
            return game;
        } catch (error) {
            console.error('Error getting game by id:', error);
            throw error;
        }
    }

    static async update({
        gameID,
        name,
        type, 
        imageURL, 
        isExchange, 
        guide
    }: IGame): Promise<void> {
        if (!gameID) throw new Error('Cannot updating game without ID');

        try {
            await db.query(
                'CALL SP_UPDATE_GAMECONFIG($1, $2, $3, $4, $5, $6)', 
                [gameID, name, type, imageURL, isExchange, guide]
            );
        } catch (error) {
            console.error('Error updating game:', error);
            throw error;   
        }
    }
}    
export { Game, IGame };
