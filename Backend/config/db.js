const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbconnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// Magdagdag ka ng console log para makita natin kung ano ang nababasa niya
console.log("Connecting to:", process.env.DB_HOST);

// Test the database connection
dbconnection.getConnection()
    .then(connection => {
        console.log('Database connection established successfully.');
        connection.release();
    })
    .catch(error => {
        console.error('Error connecting to the database:', error);
    });


module.exports = dbconnection;
