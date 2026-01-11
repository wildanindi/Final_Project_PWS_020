const crypto = require('crypto');
const User = require('../models/User');
const Menu = require('../models/Menu');
const Order = require('../models/Order'); 
const Payment = require('../models/Payment'); 
const Category = require('../models/Category'); 

exports.dashboard = (req, res) => {
    User.findById(req.session.userId, (err, results) => {
        if (err) throw err;
        res.render('user_dashboard', { user: results[0], error: null });
    });
};

exports.processPayment = (req, res) => {
    User.updatePaymentStatus(req.session.userId, 'paid', (err) => {
        if (err) throw err;
        res.redirect('/user/dashboard');
    });
};

exports.generateKey = (req, res) => {
    // Cek status bayar dulu via DB
    User.findById(req.session.userId, (err, results) => {
        if (results[0].payment_status !== 'paid') {
            return res.send("Bayar dulu bos!");
        }
        
        const newApiKey = crypto.randomBytes(16).toString('hex');
        User.updateApiKey(req.session.userId, newApiKey, (err) => {
            if (err) throw err;
            res.redirect('/user/dashboard');
        });
    });
};

exports.validateKey = (req, res) => {
    const inputKey = req.body.input_key;
    
    User.findById(req.session.userId, (err, results) => {
        const userKey = results[0].api_key;
        
        if (inputKey === userKey && userKey !== null) {
            req.session.menuUnlocked = true;
            res.redirect('/user/menu-list');
        } else {
            res.render('user_dashboard', { user: results[0], error: 'API Key salah! Cek lagi.' });
        }
    });
};

exports.listMenu = (req, res) => {
    if (!req.session.menuUnlocked) {
        return res.redirect('/user/dashboard');
    }

    // 1. Ambil Kategori dulu
    Category.getAll((err, categories) => {
        if (err) throw err;

        // 2. Baru ambil Menu
        Menu.getAll((err, menus) => {
            if (err) throw err;

            // 3. Render view dengan membawa DUA data: menus DAN categories
            res.render('menu_list', { 
                menus: menus, 
                categories: categories 
            });
        });
    });
};

// 1. Fungsi Tambah ke Keranjang
exports.addToCart = (req, res) => {
    const { menu_id, nama_menu, harga } = req.body;
    
    // Inisialisasi keranjang kalau belum ada
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Cek apakah item sudah ada di cart?
    const existingItem = req.session.cart.find(item => item.menu_id === menu_id);

    if (existingItem) {
        existingItem.quantity += 1; // Kalau ada, tambah qty
    } else {
        req.session.cart.push({
            menu_id,
            nama_menu,
            harga: parseInt(harga),
            quantity: 1
        });
    }
    
    res.redirect('/user/menu-list');
};

// 2. Fungsi Lihat Halaman Cart
exports.viewCart = (req, res) => {
    const cart = req.session.cart || [];
    // Hitung total harga belanjaan
    const total = cart.reduce((sum, item) => sum + (item.harga * item.quantity), 0);
    
    res.render('cart', { cart, total });
};

// 3. Fungsi Checkout (Simpan ke Database)
exports.checkout = (req, res) => {
    const cart = req.session.cart || [];
    const userId = req.session.userId;
    const total = cart.reduce((sum, item) => sum + (item.harga * item.quantity), 0);

    if (cart.length === 0) return res.redirect('/user/menu-list');

    // Create Order
    Order.createOrder(userId, total, (err, result) => {
        if (err) throw err;
        const orderId = result.insertId;

        // Simpan Detail Item
        cart.forEach((item) => {
            const subtotal = item.harga * item.quantity;
            Order.createOrderItem(orderId, item.menu_id, item.quantity, subtotal, (e) => {});
        });

        // Kosongkan keranjang
        req.session.cart = [];
        
        // [UBAH DISINI] Jangan langsung sukses, tapi arahkan ke halaman bayar
        res.redirect(`/user/payment/${orderId}`);
    });
};

exports.paymentPage = (req, res) => {
    const orderId = req.params.id;
    // Cari total harga dari order (query simple via model Order perlu ditambah findById, tapi kita ambil dari DB manual dlu buat contoh)
    const db = require('../config/database');
    db.query('SELECT * FROM orders WHERE id = ?', [orderId], (err, results) => {
        if(err || results.length === 0) return res.redirect('/user/dashboard');
        res.render('payment', { order: results[0] });
    });
};

// [BARU] Proses Bayar
exports.processPayment = (req, res) => {
    const { order_id, amount, payment_method } = req.body;
    
    // 1. Simpan ke tabel payments
    Payment.create(order_id, amount, payment_method, (err) => {
        if (err) throw err;

        // 2. Update status order jadi 'cooking' (atau 'paid') karena sudah dibayar
        const db = require('../config/database');
        db.query("UPDATE orders SET status = 'cooking' WHERE id = ?", [order_id], (err) => {
             res.render('success_order', { orderId: order_id });
        });
    });
};