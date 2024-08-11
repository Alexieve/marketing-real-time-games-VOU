export interface DBConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

const config: DBConfig = {
  host: 'postgres-user-srv',
  port: 5432,
  database: 'auth-db',
  user: 'auth-admin',
  password: 'auth-admin',
};

export default config;