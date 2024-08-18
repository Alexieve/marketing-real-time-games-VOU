import express, {Request, Response} from 'express';
import { loginValidator } from '../utils/validators';
import { validateRequest } from '@vmquynh-vou/shared';
import { User } from '../models/user';
import { BadRequestError } from '@vmquynh-vou/shared';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
// import { pool } from '../connection';
import db from '../connection';

const route = express.Router();

route.get('/api/usermanagement/countpage', async (req: Request, res: Response) => {
      const { name, role } = req.query;
      console.log(name);
      console.log(role);
      console.log('test');

      let query = 'SELECT COUNT(*) FROM "USER" WHERE 1=1'; // Start with a base query

    // Add conditions to the query based on the name and role
    if (name) {
      query += ` AND name LIKE '%${name}%'`; // ILIKE for case-insensitive search
    }
    if (role && role !== 'All') {
      query += ` AND role = '${role}'`;
    }

    const result = await db.query(query);  
      if (!result) {
        throw new BadRequestError('Can not load number page');
      }
      const count = result.rows[0].count;

      res.send( count );
  });

export {route as usermanagementRouter_CountPage};
