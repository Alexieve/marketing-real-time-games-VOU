import express, {Request, Response} from 'express';
import { BadRequestError } from '@vmquynh-vou/shared';
import db from '../connection';

const route = express.Router();

route.get('/api/user-management/countpage', async (req: Request, res: Response) => {
  const { name, role } = req.query;

  let query = 'SELECT COUNT(*) FROM "USER" WHERE 1=1'; 

  if (role && role !== 'All') {
    query += ` AND role = '${role}'`;
  }
  if (name) {
    query += ` AND name LIKE '%${name}%'`;
  }

  const result = await db.query(query);  
  if (!result) {
    throw new BadRequestError('Can not load number of page');
  }
  const count = result.rows[0].count;

  res.send( count );
});

export {route as CountPageRoute};
