import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const pool = mysql.createConnection(process.env.DATABASE_URL);

export default pool.promise();