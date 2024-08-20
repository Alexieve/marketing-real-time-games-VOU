import { Pool } from 'pg';

interface DBConfig {
  admin: string;
  password: string;
  host: string;
  port: string;
  database: string;
}

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    const config: DBConfig = {
      admin: process.env.DB_ADMIN as string,
      password: process.env.DB_PASSWORD as string,
      host: process.env.DB_HOST as string,
      port: process.env.DB_PORT as string,
      database: process.env.DB_DATABASE as string,
    };

    const connectionString = `postgresql://${config.admin}:${config.password}@${config.host}:${config.port}/${config.database}`;

    this.pool = new Pool({ connectionString });

    this.pool.on('connect', () => {
      console.log('Connected to the database');
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
}

export default Database.getInstance();