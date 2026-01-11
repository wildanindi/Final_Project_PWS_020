const db = require('../config/database');

const Payment = {
    create: (orderId, amount, method, callback) => {
        const query = 'INSERT INTO payments (order_id, amount, payment_method) VALUES (?, ?, ?)';
        db.query(query, [orderId, amount, method], callback);
    }
};

module.exports = Payment;