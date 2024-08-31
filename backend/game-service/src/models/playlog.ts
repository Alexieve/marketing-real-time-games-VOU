import db from '../connection';
import { RedisClient } from '@vmquynh-vou/shared';

interface IPlayLog{
    customerID: number | null;
    eventID: string | null;
    time: string | null;
}


class PlayLog implements IPlayLog{
    customerID: number | null;
    eventID: string | null;
    time: string | null;

    constructor({customerID, eventID, time}: IPlayLog) {
        this.customerID = customerID;
        this.eventID = eventID;
        this.time = time;
    }

    static async get({customerID, eventID}: IPlayLog): Promise<PlayLog[] | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_GET_PLAYLOG_BY_CUSTOMERID($1, $2)',
                [customerID, eventID]
            );            
            if (res.rows.length === 0) return null;
            const playLog = res.rows.map((row: any) => new PlayLog({
                customerID: row.customerid,
                eventID: row.eventid,
                time: row.time.toISOString().slice(0, 19).replace('T', ' ')
            }));
            return playLog;
        } catch (err) {
            console.error('Error getting play log:', err);
            return null;
        }
    }

    static async add({customerID, eventID}: IPlayLog): Promise<void> {
        try {
            await db.query(
                'CALL SP_ADD_PLAYLOG($1, $2)',
                [customerID, eventID]
            );
        } catch (error) {
            console.error('Error adding playlog:', error);
            throw error;
        }
    }
}    
export { PlayLog, IPlayLog };
