import { Pool } from 'pg';
import config from './dbConfig';

const connectionString = `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;

const pool = new Pool({ connectionString });

pool.on('connect', () => {
  console.log('Connected to the database');
});


export { pool };
