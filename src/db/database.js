const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.REACT_APP_DB_HOST || '31.31.196.64',
    user: process.env.REACT_APP_DB_USER || 'u1662596_shaurma',
    password: process.env.REACT_APP_DB_PASSWORD || 'uV6kZ2mR6alL2aT5',
    database: process.env.REACT_APP_DB_NAME || 'u1662596_shaurma',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const query = async (sql, params) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};

module.exports = {
    query,
    pool,
    testConnection
}; 