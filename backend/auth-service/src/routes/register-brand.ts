import express, {Request, Response} from 'express';
import { BadRequestError } from '@vmquynh-vou/shared';
import { registerValidator } from '../utils/validators';
import jwt from 'jsonwebtoken';
import { validateRequest } from '@vmquynh-vou/shared';
import { requestAPI } from '@vmquynh-vou/shared';
// import RabbitMQ from '../utils/rabbitmq';

const route = express.Router();

route.post('/api/auth/register/brand', registerValidator, validateRequest,
async (req: Request, res: Response) => {
    const {name, email, phonenum, password, field, address} = req.body;
    const data = {name, email, phonenum, password, field, address};
    
    // const rabbitmq = RabbitMQ.getInstance('user-exchange');
    // await rabbitmq.connect();
    // const responseData = await rabbitmq.requestReply('user-exchange', 'user.create-brand', data);
    // if (responseData.headers && responseData.headers.error) {
    //     console.error(`Error occurred: ${responseData.msg}`);
    // } else {
    //     console.log('Success:', responseData);
    // }

    let brand = null;
    try {
        brand = await requestAPI('http://user-srv:3000/api/user/create/brand', 'POST', data); 
    } catch (error: any) {
        throw new BadRequestError(error);
    }

    const userJwt = jwt.sign({
        id: brand.id,
        name: brand.name,
        email: brand.email,
        phonenum: brand.phonenum,
        status: brand.status,
        role: brand.role
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    };

    return res.status(201).send(brand);
});

export {route as registerRouter};