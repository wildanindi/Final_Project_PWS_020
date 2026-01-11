const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
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
                // Login Berhasil! Set Session dasar dulu
                req.session.userId = user.id;
                req.session.role = user.role;
                req.session.username = user.username;
                req.session.menuUnlocked = false; // Reset akses menu

                // [LOGIC BARU] Generate API Key Baru setiap Login
                const newApiKey = crypto.randomBytes(16).toString('hex');

                // Update Key ke Database
                User.updateApiKey(user.id, newApiKey, (err) => {
                    if (err) throw err;

                    // Setelah update key sukses, baru redirect sesuai role
                    if (user.role === 'admin') {
                        return res.redirect('/admin/dashboard');
                    }
                    
                    // User diarahkan ke dashboard (dimana API Key baru akan tampil)
                    return res.redirect('/user/dashboard');
                });

            } else {
                res.send('Password salah bro');
            }
        } else {
            res.send('User gak ketemu');
        }
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