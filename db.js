const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(`${process.env.SERVICE_URI}`);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the MySQL database.');
});

module.exports = db;
