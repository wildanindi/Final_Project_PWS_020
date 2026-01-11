const Menu = require('../models/Menu');
const Order = require('../models/Order'); 
const Report = require('../models/Report');
const Category = require('../models/Category');

exports.dashboard = (req, res) => {
    // 1. Ambil Menu
    Menu.getAll((err, menus) => {
        if (err) throw err;
        
        // 2. [BARU] Ambil Kategori juga
        Category.getAll((err, categories) => {
            if (err) throw err;

            // 3. Kirim DUANYA ke view
            res.render('admin_dashboard', { 
                menus: menus,
                categories: categories // <-- Data ini buat isi dropdown
            });
        });
    });
};

exports.addMenu = (req, res) => {
    const data = {
        nama_menu: req.body.nama_menu,
        harga: req.body.harga,
        deskripsi: req.body.deskripsi,
        category_id: req.body.category_id // [BARU] Tangkap ID Kategori
    };
    
    Menu.create(data, (err) => {
        if (err) throw err;
        res.redirect('/admin/dashboard');
    });
};

exports.deleteMenu = (req, res) => {
    const id = req.params.id;
    Menu.delete(id, (err) => {
        if (err) throw err;
        res.redirect('/admin/dashboard');
    });
};

exports.listOrders = (req, res) => {
    Order.getAllOrders((err, orders) => {
        if (err) throw err;
        res.render('admin_orders', { orders });
    });
};

exports.updateOrderStatus = (req, res) => {
    const { id, status } = req.body;
    Order.updateStatus(id, status, (err) => {
        if (err) throw err;
        res.redirect('/admin/orders');
    });
};

exports.viewReports = (req, res) => {
    Report.getDailyReport((err, results) => {
        if (err) throw err;
        res.render('admin_reports', { reports: results });
    });
};

// ... import Category dan Menu di atas ...

// [BARU] Tampilkan Halaman Edit
exports.editMenuPage = (req, res) => {
    const id = req.params.id;

    // 1. Ambil data menu yg mau diedit
    Menu.findById(id, (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) return res.redirect('/admin/dashboard');

        const menuToEdit = rows[0];

        // 2. Ambil kategori (buat dropdown)
        Category.getAll((err, categories) => {
            if (err) throw err;
            
            // 3. Render halaman edit
            res.render('admin_edit_menu', { 
                menu: menuToEdit, 
                categories: categories 
            });
        });
    });
};

// [BARU] Proses Update ke Database
exports.updateMenu = (req, res) => {
    const id = req.params.id;
    const data = {
        nama_menu: req.body.nama_menu,
        harga: req.body.harga,
        deskripsi: req.body.deskripsi,
        category_id: req.body.category_id
    };

    Menu.update(id, data, (err) => {
        if (err) throw err;
        res.redirect('/admin/dashboard');
    });
};