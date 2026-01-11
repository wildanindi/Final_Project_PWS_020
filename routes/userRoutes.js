const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireLogin } = require('../middlewares/authMiddleware');

// Semua route di sini butuh login
router.use(requireLogin);

router.get('/dashboard', userController.dashboard);
router.post('/pay', userController.processPayment);
router.post('/generate-key', userController.generateKey);
router.post('/validate-key', userController.validateKey);
router.get('/menu-list', userController.listMenu);
// ...
router.post('/add-to-cart', userController.addToCart);
router.get('/cart', userController.viewCart);
router.post('/checkout', userController.checkout);
// ...
// ...
router.get('/payment/:id', userController.paymentPage);
router.post('/process-payment', userController.processPayment);
// ...

module.exports = router;