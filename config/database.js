const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Sesuaikan user kamu
    password: 'Semogaditerima123',      // Sesuaikan password kamu
    database: 'db_cafe',
    port: 3308
});

db.connect((err) => {
    if (err) {
        console.error('Gagal konek database:', err);
    } else {
        console.log('Database MySQL Konek, Bos!');
    }
});

module.exports = db;