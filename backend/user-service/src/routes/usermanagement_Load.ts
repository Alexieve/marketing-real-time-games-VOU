import express, {Request, Response} from 'express';
import { loginValidator } from '../utils/validators';
import { validateRequest } from '@vmquynh-vou/shared';
import { User } from '../models/user';
import { BadRequestError } from '@vmquynh-vou/shared';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
import db from '../connection';
const route = express.Router();

// route.get('/api/usermanagement/load', async (req: Request, res: Response) => {
//       const users = await User.findAllUser();
//       if (!users) {
//         throw new BadRequestError('Can not load data');
//       }
//       //console.log('check Users:', users);
//       res.send(users);

//   });
route.get('/api/usermanagement/load', async (req: Request, res: Response) => {
  const { name, role, offset } = req.query;
  console.log(name);
  console.log(role);
  console.log(offset);
  console.log('test');
  const users = await User.findAllUserSearch(name as string, role as string, offset as string);
  // const result = await pool.query(
  //   'SELECT * FROM "USER"'
  // );
  if (!users) {
    throw new BadRequestError('Can not load data');
  }
  //console.log('check Users:', users);
  res.send(users);

});

export {route as usermanagementRouter_Load};
