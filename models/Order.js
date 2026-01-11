const db = require('../config/database');

const Order = {
    // Simpan Order Baru (Header)
    createOrder: (userId, total, callback) => {
        const query = 'INSERT INTO orders (user_id, total_harga, status) VALUES (?, ?, ?)';
        db.query(query, [userId, total, 'pending'], callback);
    },

    // Simpan Item Order (Detail)
    createOrderItem: (orderId, menuId, qty, subtotal, callback) => {
        const query = 'INSERT INTO order_items (order_id, menu_id, quantity, subtotal) VALUES (?, ?, ?, ?)';
        db.query(query, [orderId, menuId, qty, subtotal], callback);
    },

    // Ambil Semua Order (Untuk Admin)
    getAllOrders: (callback) => {
        // Kita join table user biar tau siapa yang pesan
        const query = `
            SELECT orders.*, users.username 
            FROM orders 
            JOIN users ON orders.user_id = users.id 
            ORDER BY orders.created_at DESC`;
        db.query(query, callback);
    },

    // Ambil Detail Item per Order (Untuk Admin liat isi pesanan)
    getOrderItems: (orderId, callback) => {
        const query = `
            SELECT order_items.*, menus.nama_menu 
            FROM order_items 
            JOIN menus ON order_items.menu_id = menus.id 
            WHERE order_items.order_id = ?`;
        db.query(query, [orderId], callback);
    },

    // Update Status Order (Pending -> Cooking -> Served)
    updateStatus: (id, status, callback) => {
        const query = 'UPDATE orders SET status = ? WHERE id = ?';
        db.query(query, [status, id], callback);
    }
};

module.exports = Order;