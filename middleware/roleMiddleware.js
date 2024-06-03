// ellenorzi, hogy a felhasznalo be van-e jelentkezve
function ensureAuthenticated(req, res, next) {
    if (req.session.loggedin) {
        return next(); // ha be van jelentkezve, tovabblep
    }
    res.redirect('/login'); // ha nincs bejelentkezve, atiranyit a bejelentkezes oldalra
}

// ellenorzi, hogy a felhasznalonak megfelelo szerepkore van-e
function ensureRole(role) {
    return (req, res, next) => {
        if (req.session.loggedin && req.session.user.role === role) {
            return next(); // ha megfelelo szerepkore van, tovabblep
        }
        res.status(403).send('Hozzaferes megtagadva'); // ha nincs megfelelo szerepkore, hozzaferes megtagadva
    };
}

// ellenorzi, hogy a felhasznalonak egyike van-e a megadott szerepkoroknak
function ensureRoles(roles) {
    return (req, res, next) => {
        if (req.session.loggedin && roles.includes(req.session.user.role)) {
            return next(); // ha megfelelo szerepkore van, tovabblep
        }
        res.status(403).send('Hozzaferes megtagadva'); // ha nincs megfelelo szerepkore, hozzaferes megtagadva
    };
}

module.exports = {
    ensureAuthenticated,
    ensureRole,
    ensureRoles
};
