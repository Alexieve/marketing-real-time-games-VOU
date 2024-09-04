import express, { Request, Response } from 'express';
import { BadRequestError } from '@vmquynh-vou/shared';
import { brandRegisterValidator, customerRegisterValidator } from '../utils/validators';
import jwt from 'jsonwebtoken';
import { validateRequest } from '@vmquynh-vou/shared';
import { requestAPI } from '@vmquynh-vou/shared';
import { rabbitMQWrapper } from '@vmquynh-vou/shared';
import { BrandCreatedPublisher, CustomerCreatedPublisher } from '../events/publishers/user-created-publisher';
import { RedisClient } from '@vmquynh-vou/shared';

const twilio = require('twilio');
const otpGenerator = require('otp-generator');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);

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

    return res.status(201).send({user: brand, token: userJwt});
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

    return res.status(201).send({user: customer, token: userJwt});
});

route.post('/api/auth/send-otp', async (req: Request, res: Response) => {
    const { email } = req.body;
    let tmp = req.body.phonenum;
    const phonenum = `+84${tmp.slice(1)}`;

    let result = "";
    try {
        await requestAPI(`http://user-srv:3000/api/user-management/load/by-email/${email}`, 'GET', null);
        result = "Email already exists!";
    } catch (error: any) {
        console.log(error);
    }

    try {
        await requestAPI(`http://user-srv:3000/api/user-management/load/by-phonenum/${phonenum}`, 'GET', null);
        result = "Phone number already exists!";
    } catch (error: any) {
        console.log(error);
    }

    if (result !== "") {
        throw new BadRequestError(result);
    }

    const otp = otpGenerator.generate(6, { 
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false, 
        specialChars: false, 
    });

    try {
        await twilioClient.messages.create({
            body: `Your OTP is: ${otp}`,
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,            
            to: phonenum
        });
    } catch (error: any) {
        throw new BadRequestError(error);
    }

    const cacheKey = `otp:${tmp}`;
    await RedisClient.set(cacheKey, otp, 300);

    return res.status(200).send("OTP sent successfully!");
});

route.post('/api/auth/verify-otp', async (req: Request, res: Response) => {
    const { infor, otp } = req.body;
    const { name, email, phonenum, password, gender } = infor;

    const cacheKey = `otp:${phonenum}`;
    const cachedOtp = (await RedisClient.get(cacheKey))?.toString();

    console.log("cachedOtp: ", cachedOtp, typeof cachedOtp);
    console.log("otp: ", otp, typeof otp);

    if (!cachedOtp) {
        throw new BadRequestError("OTP has expired!");
    }

    if (otp !== cachedOtp) {
        throw new BadRequestError("Invalid OTP!");
    }

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

    await RedisClient.delete(cacheKey);


    return res.status(201).send({user: customer, token: userJwt});
});

export { route as registerRouter };