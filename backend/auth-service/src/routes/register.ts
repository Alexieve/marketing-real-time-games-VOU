import express, { Request, Response } from 'express';
import { BadRequestError } from '@vmquynh-vou/shared';
import { brandRegisterValidator, customerRegisterValidator } from '../utils/validators';
import jwt from 'jsonwebtoken';
import { validateRequest } from '@vmquynh-vou/shared';
import { requestAPI } from '@vmquynh-vou/shared';
import { rabbitMQWrapper } from '@vmquynh-vou/shared';
import { BrandCreatedPublisher, CustomerCreatedPublisher } from '../events/publishers/user-created-publisher';

const route = express.Router();

function signJWT(user: any) {
    return jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        phonenum: user.phonenum,
        status: user.status,
        role: user.role
    }, process.env.JWT_KEY!);
}

route.post('/api/auth/register/brand', brandRegisterValidator, validateRequest,
    async (req: Request, res: Response) => {
        const { name, email, phonenum, password, field, address } = req.body;
        const status = true;
        const data = { name, email, phonenum, password, status, field, address };

        await new BrandCreatedPublisher(rabbitMQWrapper.channel).publish({
            name: name,
            email: email,
            phonenum: phonenum,
            status: status,
            role: 'Brand',
            field: field,
            address: address
        });

        let brand = null;
        try {
            brand = await requestAPI('http://user-srv:3000/api/user-management/create/brand', 'POST', data);
        } catch (error: any) {
            throw new BadRequestError(error);
        }

        const userJwt = signJWT(brand);
        req.session = {
            jwt: userJwt
        };

        return res.status(201).send(brand);
    });

route.post('/api/auth/register/customer', customerRegisterValidator, validateRequest,
    async (req: Request, res: Response) => {
        const { name, email, phonenum, password, gender } = req.body;
        const status = true;
        const data = { name, email, phonenum, password, status, gender };

        let customer = null;
        try {
            customer = await requestAPI('http://user-srv:3000/api/user-management/create/customer', 'POST', data);
        } catch (error: any) {
            throw new BadRequestError(error);
        }

        const userJwt = signJWT(customer);
        req.session = {
            jwt: userJwt
        };

        return res.status(201).send(customer);
    });

export { route as registerRouter };