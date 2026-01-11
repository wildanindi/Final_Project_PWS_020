const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Konfigurasi Middleware Standar
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Pastikan folder views terbaca
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // (Opsional) kalau ada CSS eksternal

// Konfigurasi Session
app.use(session({
    secret: 'rahasia_negara_api',
    resave: false,
    saveUninitialized: true
}));

// Gunakan Routes
// Prefix URL biar rapi
app.use('/auth', authRoutes);   // url jadi: /auth/login, /auth/register
app.use('/admin', adminRoutes); // url jadi: /admin/dashboard
app.use('/user', userRoutes);   // url jadi: /user/dashboard

// Redirect halaman depan ke login
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// Jalankan Server
app.listen(3000, () => {
    console.log('Server MVC jalan di http://localhost:3000');
});