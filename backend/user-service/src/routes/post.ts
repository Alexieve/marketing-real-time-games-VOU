import express, {Request, Response} from 'express';
import { Brand } from '../models/brand';
import { Customer } from '../models/customer';
import { BadRequestError } from '@vmquynh-vou/shared';

const route = express.Router();

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

    const customer = await Customer.createCustomer(
        {name, email, phonenum, password, status, gender}
    );

    res.status(201).send(customer);
});

export {route as postRouter};