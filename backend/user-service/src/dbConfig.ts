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
  database: 'user-db',
  user: 'user-admin',
  password: 'user-admin',
};

export default config;