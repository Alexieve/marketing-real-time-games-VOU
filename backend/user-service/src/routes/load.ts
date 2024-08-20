import express, {Request, Response} from 'express';
import { User } from '../models/user';
import { BadRequestError, requireRole } from '@vmquynh-vou/shared';
const route = express.Router();

route.get('/api/user-management/load', 
  // (req, res, next) => requireRole(req, res, next, ['Admin']),
  async (req: Request, res: Response) => {
  const { name, role, offset } = req.query;
  const users = await User.findAllUserSearch(name as string, role as string, offset as string);
  if (!users) {
    throw new BadRequestError('No user found!');
  }
  res.status(200).send(users);
});

route.get('/api/user-management/load/by-email/:email', 
  async (req: Request, res: Response) => {
  const { email } = req.params;
  console.log(email);
  const existingUser = await User.findByEmail(email);
  if (!existingUser) {
    throw new BadRequestError('User not found!');
  }
  res.status(200).send(existingUser);
});

export {route as LoadRoute};
