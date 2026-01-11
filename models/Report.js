const db = require('../config/database');

const Report = {
    // Laporan Pendapatan Harian (Group by Tanggal)
    getDailyReport: (callback) => {
        const query = `
            SELECT 
                DATE(created_at) as tanggal, 
                COUNT(id) as total_transaksi, 
                SUM(total_harga) as pendapatan
            FROM orders 
            WHERE status = 'served' OR status = 'cooking' 
            GROUP BY DATE(created_at) 
            ORDER BY tanggal DESC
        `;
        db.query(query, callback);
    }
};

module.exports = Report;