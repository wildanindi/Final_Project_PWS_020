const db = require('../config/database');

const User = {
    create: (username, password, role, callback) => {
        const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        db.query(query, [username, password, role], callback);
    },
    findByUsername: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], callback);
    },
    findById: (id, callback) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [id], callback);
    },
    updateApiKey: (id, apiKey, callback) => {
        const query = 'UPDATE users SET api_key = ? WHERE id = ?';
        db.query(query, [apiKey, id], callback);
    },
    updatePaymentStatus: (id, status, callback) => {
        const query = 'UPDATE users SET payment_status = ? WHERE id = ?';
        db.query(query, [status, id], callback);
    }
};

module.exports = User;