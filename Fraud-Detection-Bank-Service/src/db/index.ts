import { Pool } from 'pg';
import config from '../config/env';


export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name
});


export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connected successfully');
        client.release();
    } catch(error) {
        console.error('Database connection failed');
        process.exit(1);
    }
};


export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
