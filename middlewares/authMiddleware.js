exports.requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    next();
};

exports.requireAdmin = (req, res, next) => {
    if (req.session.role !== 'admin') {
        return res.send('Eits, kamu bukan Admin! Akses ditolak.');
    }
    next();
};