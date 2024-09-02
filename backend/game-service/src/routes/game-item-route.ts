import express, {Request, Response} from 'express';
import { BadRequestError } from '@vmquynh-vou/shared';
import { GameItem } from '../models/game-item';
import { CustomerItem } from '../models/customer-item';
import { ExchangeLog } from '../models/exchange-log';
import { RedisClient } from '@vmquynh-vou/shared';
const route = express.Router();

route.get('/api/game/game-item/:eventID', 
async (req: Request, res: Response) => {
    try {
        if (req.params.eventID) {
            const eventID = req.params.eventID as string;

            const cacheKey = `game-item:${eventID}`;
            const cacheData = await RedisClient.get(cacheKey);
            if (cacheData) {
                res.send(cacheData);
                return;
            }

            const gameItems = await GameItem.getGameItems(eventID);

            await RedisClient.set(cacheKey, JSON.stringify(gameItems), 60);

            res.send(gameItems);
        } else {
            throw new BadRequestError("Cannot loading event game without ID!");
        }        
    } catch (error: any) {
        throw new BadRequestError(error);
    }
});

route.get('/api/game/customer-item', 
async (req: Request, res: Response) => {
    try {
        const customerID = req.query.customerID? parseInt(req.query.customerID as string) : undefined;  
        const eventID = req.query.eventID? (req.query.eventID as string) : undefined 
        if (customerID === undefined || eventID === undefined) {
            throw new BadRequestError("Cannot loading customer item without ID!");
        }
        const itemID = req.query.itemID ? parseInt(req.query.itemID as string) : undefined; 

        if (itemID !== undefined) {
            const cacheKey = `customer-item:${customerID}:${eventID}`;
            const cacheData = await RedisClient.get(cacheKey);
            if (cacheData) {
                res.send(cacheData);
                return;
            }
            
            const customerItem = await CustomerItem.getCustomerItem_By_ItemID({ customerID, eventID, itemID, quantity: null });
            
            await RedisClient.set(cacheKey, JSON.stringify(customerItem), 60);

            res.status(200).send(customerItem);
        } else {
            const customerItems = await CustomerItem.getCustomerItems({ customerID, eventID, itemID: null, quantity: null });
            res.status(200).send(customerItems);
        }        
    } catch (error: any) {
        throw new BadRequestError(error);
    }
});
    
route.post('/api/game/customer-item',
async (req: Request, res: Response) => {
    const { customerID, eventID, items } = req.body;
    console.log("customerID: ", customerID);
    console.log("eventID: ", eventID);
    console.log("items: ", items);
    try {
        items.map(async (item: any) => {
            const dbItem = await GameItem.getGameItem_By_ItemID(item.itemID);
            if (!dbItem) {
                throw new BadRequestError("Cannot find item in game!");
            }
            
            const ExistItem = await CustomerItem.getCustomerItem_By_ItemID({ customerID, eventID, itemID: item.itemID, quantity: null });

            if (ExistItem) {
                await CustomerItem.update({ customerID, eventID, itemID: item.itemID, quantity: item.quantity });
                await ExchangeLog.add({ 
                    customerID, 
                    eventID, 
                    timeExchange: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    itemID: item.itemID, 
                    quantity: item.quantity - (ExistItem?.quantity ?? 0),
                    description: `Receive ${item.quantity - (ExistItem?.quantity ?? 0)} ${dbItem.name}`
                });
            } else {
                await CustomerItem.add({ customerID, eventID, itemID: item.itemID, quantity: item.quantity });
                await ExchangeLog.add({
                    customerID, 
                    eventID, 
                    timeExchange: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    itemID: item.itemID, 
                    quantity: item.quantity,
                    description: `Receive ${item.quantity} ${dbItem.name}`
                });
            }
        });
        await RedisClient.delete(`customer-item:${customerID}:${eventID}`);
        res.send("Add customer item successfully!");
    }
    catch (error) {
        throw new BadRequestError("Cannot Adding customer item!");
    }
});


route.put('/api/game/customer-item',
async (req: Request, res: Response) => {
    const { customerID, eventID, items } = req.body;
    try {
        items.map(async (item: any) => {
            const dbItem = await GameItem.getGameItem_By_ItemID(item.itemID);
            if (!dbItem) {
                throw new BadRequestError("Cannot find item in game!");
            }
            
            const ExistItem = await CustomerItem.getCustomerItem_By_ItemID({ customerID, eventID, itemID: item.itemID, quantity: null });
            if (ExistItem) {
                await CustomerItem.update({ customerID, eventID, itemID: item.itemID, quantity: item.quantity });
                await ExchangeLog.add({ 
                    customerID, 
                    eventID, 
                    timeExchange: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    itemID: item.itemID, 
                    quantity: item.quantity - (ExistItem?.quantity ?? 0),
                    description: `Exchange ${(ExistItem?.quantity ?? 0) - item.quantity} ${dbItem.name}`
                });
            }
            else
                throw new BadRequestError("Cannot find item in customer!");
        });
        await RedisClient.delete(`customer-item:${customerID}:${eventID}`);
        res.send("Update customer item successfully!");
    }
    catch (error) {
        throw new BadRequestError("Cannot updating customer item!");
    }
});

route.get('/api/game/exchange-log/:customerID/:eventID',
async (req: Request, res: Response) => {
    try {
        const { customerID, eventID } = req.params;
        const exchangeLog = await ExchangeLog.get({ 
            customerID: parseInt(customerID),
            eventID: eventID,
            timeExchange: null,
            itemID: null,
            quantity: null,
            description: null
        });
        res.send(exchangeLog);
    } catch (error: any) {
        throw new BadRequestError(error);
    }
});

export {route as GameItemRoute};
