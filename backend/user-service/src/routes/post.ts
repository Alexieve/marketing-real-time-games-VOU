import express, {Request, Response} from 'express';
import { Brand } from '../models/brand';
import { Customer } from '../models/customer';
import { BadRequestError } from '@vmquynh-vou/shared';
// import RabbitMQ from '../utils/rabbitmq';

const route = express.Router();

// async function startConsumer(exchange: string) {
//     const rabbitmq = RabbitMQ.getInstance(exchange);
//     await rabbitmq.connect();
//     try {
//         // await rabbitmq.consume('user-queue', 'user.*', async (msg: any) => {
//         //     console.log(`[<<] Received message: ${msg.email}`);
//         // });
//         const processFunction = (msg: any) => {
//             console.log(msg);
//             return new BadRequestError('Email in use');
//         }
//         await rabbitmq.handleRequest('user-queue', 'user.*', processFunction);
//     } catch (error) {
//         console.log(error);
//     }
// }
// startConsumer('user-exchange');

route.post('/api/user/create/brand', async (req: Request, res: Response) => {
    const {name, email, phonenum, password, status, field, address} = req.body;
    
    const existingBrand = await Brand.findByEmail(email) || null!;
    
    if (existingBrand) {
        throw new BadRequestError('Email in use');
    }

    const brand = await Brand.createBrand(
        {name, email, phonenum, password, status, field, address}
    );

    res.status(201).send(brand);
});

route.post('/api/user/create/customer', async (req: Request, res: Response) => {
    const {name, email, phonenum, password, status, gender} = req.body;
    
    const existingCustomer = await Customer.findByEmail(email) || null!;
    
    if (existingCustomer) {
        throw new BadRequestError('Email in use');
    }

    const customer = await Customer.createBrand(
        {name, email, phonenum, password, status, gender}
    );

    res.status(201).send(customer);
});

export {route as postRouter};