const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.formLogin);
router.post('/login', authController.processLogin);
router.get('/register', authController.formRegister);
router.post('/register', authController.processRegister);
router.get('/logout', authController.logout);

module.exports = router;