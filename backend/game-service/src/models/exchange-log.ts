import db from '../connection';

interface IExchangeLog{
    customerID: number | null;
    eventID: string | null;
    timeExchange: string | null;
    itemID: number | null;
    quantity: number | null;
    description: string | null;
}


class ExchangeLog implements IExchangeLog{
    customerID: number | null;
    eventID: string | null;
    timeExchange: string | null;
    itemID: number | null;
    quantity: number | null;
    description: string | null;

    constructor({customerID, eventID, timeExchange, itemID, quantity, description }: IExchangeLog) {
        this.customerID = customerID;
        this.eventID = eventID;
        this.timeExchange = timeExchange;
        this.itemID = itemID;
        this.quantity = quantity;
        this.description = description;
    }

    static async get({customerID, eventID}: IExchangeLog): Promise<ExchangeLog[] | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_GET_ALL_EXCHANGELOG_OF_CUSTOMER($1, $2)',
                [customerID, eventID]
            );            
            if (res.rows.length === 0) return null;
            const exchangeLog = res.rows.map((row: any) => new ExchangeLog({
                customerID: row.customerid,
                eventID: row.eventid,
                timeExchange: row.timeexchange.toISOString().slice(0, 19).replace('T', ' '),
                itemID: row.itemid,
                quantity: row.quantity,
                description: row.description
            }));
            return exchangeLog;
        } catch (err) {
            console.error('Error getting event item log:', err);
            return null;
        }
    }

    static async add({customerID, eventID, itemID, quantity, description}: IExchangeLog): Promise<void> {
        try {
            await db.query(
                'CALL SP_ADD_EXCHANGELOG($1, $2, $3, $4, $5)',
                [customerID, eventID, itemID, quantity, description]
            );
        } catch (error) {
            console.error('Error adding event item log:', error);
            throw error;
        }
    }
}    
export { ExchangeLog, IExchangeLog};
