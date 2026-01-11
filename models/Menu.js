const db = require('../config/database');

const Menu = {
    getAll: (callback) => {
        // Kita JOIN dengan categories biar tau nama kategorinya
        const query = `
            SELECT menus.*, categories.nama_kategori 
            FROM menus 
            LEFT JOIN categories ON menus.category_id = categories.id
            ORDER BY menus.category_id ASC`;
        db.query(query, callback);
    },
    create: (data, callback) => {
        // [UPDATE] Tambah category_id di query insert
        const query = 'INSERT INTO menus (nama_menu, harga, deskripsi, category_id) VALUES (?, ?, ?, ?)';
        db.query(query, [data.nama_menu, data.harga, data.deskripsi, data.category_id], callback);
    },
    delete: (id, callback) => {
        const query = 'DELETE FROM menus WHERE id = ?';
        db.query(query, [id], callback);
    },
    findById: (id, callback) => {
        const query = 'SELECT * FROM menus WHERE id = ?';
        db.query(query, [id], callback);
    },

    // [BARU] Update data menu
    update: (id, data, callback) => {
        const query = 'UPDATE menus SET nama_menu = ?, harga = ?, deskripsi = ?, category_id = ? WHERE id = ?';
        db.query(query, [data.nama_menu, data.harga, data.deskripsi, data.category_id, id], callback);
    }
};

module.exports = Menu;