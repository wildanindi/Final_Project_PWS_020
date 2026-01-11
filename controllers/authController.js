const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.formLogin = (req, res) => {
    res.render('login');
};

exports.processLogin = (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.userId = user.id;
                req.session.role = user.role;
                req.session.username = user.username;
                
                // Reset status akses menu saat login baru
                req.session.menuUnlocked = false; 

                if (user.role === 'admin') {
                    return res.redirect('/admin/dashboard');
                }
                return res.redirect('/user/dashboard');
            }
        }
        res.send('Username atau Password salah bro');
    });
};

exports.formRegister = (req, res) => {
    res.render('register');
};

exports.processRegister = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    User.create(username, hashedPassword, 'user', (err) => {
        if (err) throw err;
        res.redirect('/auth/login');
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
};