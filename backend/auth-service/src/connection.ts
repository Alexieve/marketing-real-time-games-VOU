import { Pool } from 'pg';

// Load environment variables
const host_name = process.env.DB_HOST_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;

// Load connection string
const connectionString = `${host_name}://${user}:${password}@${host}:${port}/${database}`;
const pool = new Pool({ connectionString });

pool.on('connect', () => {
  console.log('Connected to the database');
});


export { pool };
