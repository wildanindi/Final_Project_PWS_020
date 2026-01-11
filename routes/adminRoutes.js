const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireLogin, requireAdmin } = require('../middlewares/authMiddleware');

// Semua route di sini otomatis kena middleware Login & Admin
router.use(requireLogin, requireAdmin);

router.get('/dashboard', adminController.dashboard);
router.post('/add-menu', adminController.addMenu);
router.get('/delete/:id', adminController.deleteMenu);
// ...
router.get('/orders', adminController.listOrders);
router.post('/order-status', adminController.updateOrderStatus);
// ...
router.get('/reports', adminController.viewReports); 
// ...
router.get('/edit/:id', adminController.editMenuPage);  // Halaman Form Edit
router.post('/update/:id', adminController.updateMenu); // Proses Simpan Perubahan
// ...

module.exports = router;