const db = require('../config/database');

const Category = {
    getAll: (callback) => {
        const query = 'SELECT * FROM categories';
        db.query(query, callback);
    }
};

module.exports = Category;