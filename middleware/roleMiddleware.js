// middleware/roleMiddleware.js
function ensureAuthenticated(req, res, next) {
    if (req.session.loggedin) {
        return next();
    }
    res.redirect('/login');
}

function ensureRole(role) {
    return (req, res, next) => {
        if (req.session.loggedin && req.session.user.role === role) {
            return next();
        }
        res.status(403).send('Hozzáférés megtagadva');
    };
}

function ensureRoles(roles) {
    return (req, res, next) => {
        if (req.session.loggedin && roles.includes(req.session.user.role)) {
            return next();
        }
        res.status(403).send('Hozzáférés megtagadva');
    };
}

module.exports = {
    ensureAuthenticated,
    ensureRole,
    ensureRoles
};
