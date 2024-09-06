import db from '../connection';
import { GameItem, IGameItem } from './game-item';

interface ICustomerItem {
    customerID: number | null;
    eventID: string | null;
    itemID: number | null;
    quantity: number | 0;
}


class CustomerItem {
    customerID: number | null;
    eventID: string | null;
    itemID: number | null;
    quantity: number | 0;

    constructor({customerID, eventID, itemID, quantity}: ICustomerItem) {
        this.customerID = customerID || null;
        this.eventID = eventID || null;
        this.itemID = itemID || null;
        this.quantity = quantity || 0;
    }

    static async getCustomerItems({customerID, eventID}: ICustomerItem): Promise<CustomerItem[] | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_GET_ALL_EVENTGAMEITEM_OF_CUSTOMER($1, $2)',
                [customerID, eventID]
            );           
            if (res.rows.length === 0) return null;

            const customerItems = res.rows.map((row: any) => new CustomerItem({
                customerID: row.customerid,
                eventID: row.eventid,
                itemID: row.itemid,
                quantity: row.quantity,
            }));
            return customerItems;
        } catch (err) {
            console.error('Error getting all customer items:', err);
            return null;
        }
    }

    static async getCustomerItem_By_ItemID({customerID, eventID, itemID}: ICustomerItem): Promise<CustomerItem | null> {
        try {
            const res = await db.query(
                'SELECT * FROM FUNC_GET_EVENTGAMEITEM_BY_ITEMID($1, $2, $3)',
                [customerID, eventID, itemID]
            );
            if (res.rows.length === 0) return null;
            return new CustomerItem({
                customerID: res.rows[0].customerid,
                eventID: res.rows[0].eventid,
                itemID: res.rows[0].itemid,
                quantity: res.rows[0].quantity,
            });
        } catch (err) {
            console.error('Error getting customer item by item id:', err);
            return null;
        }
    }

    static async update({customerID, eventID, itemID, quantity}: ICustomerItem): Promise<void> {
        try {
            await db.query(
                'CALL SP_UPDATE_EVENTGAMEITEM_QUANTITY($1, $2, $3, $4)',
                [customerID, eventID, itemID, quantity]
            );
        } catch (err) {
            console.error('Error creating customer item:', err);
            throw err;
        }
    }

    static async add({customerID, eventID, itemID, quantity}: ICustomerItem): Promise<void> {
        try {
            db.query(
                'CALL SP_ADD_EVENTGAMEITEM($1, $2, $3, $4)',
                [customerID, eventID, itemID, quantity]
            );
        } catch (err) {
            console.error('Error creating customer item:', err);
            throw err;
        }
    }
}    
export { CustomerItem, IGameItem };
