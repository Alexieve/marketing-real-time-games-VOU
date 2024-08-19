import express, {Request, Response} from 'express';
import { BadRequestError } from '@vmquynh-vou/shared';
import db from '../connection';
const route = express.Router();

route.post('/api/user-management/update/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status } = req.body; 
  const result = await db.query(
    'UPDATE "USER" SET name = $1, status = $2 WHERE id = $3',
    [name, status, id]
  );
  if (!result) {
    throw new BadRequestError('Can not find user to update');
  }
  res.status(200).send('Done');
});
  
export {route as UpdateRoute};
