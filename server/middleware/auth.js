const jwt = require("jsonwebtoken");

// for admin
function authAdmin(req, res, next) {
    const token = req.cookies["a-auth-token"];
    if (!token) {
        return res.status(400).send("Access Denied, No token Provided!");
    }
    try {
        const decode = jwt.verify(token, process.env.ADMIN_PASSWORD);
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}

function admin(req, res, next) {
    if (!req.user.admin) {
        return res.status(403).send("Access denied");
    }
    next();
}

// for customer
function authCustomer(req, res, next) {
    const token = req.cookies["x-auth-token"];
    if (!token) {
        return res.status(400).send("Access Denied, No token Provided!");
    }
    try {
        const decode = jwt.verify(token, process.env.CUSTOMER_KEY);
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}

function customer(req, res, next) {
    if (!req.user.customer) {
        return res.status(403).send("Access denied");
    }
    next();
}

// for supplier
function authSupplier(req, res, next) {
    const token = req.cookies["s-auth-token"];
    if (!token) {
        return res.status(400).send("Access Denied, No token Provided!");
    }
    try {
        const decode = jwt.verify(token, process.env.SUPPLIER_KEY);
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}

function supplier(req, res, next) {
    if (!req.user.supplier) {
        return res.status(403).send("Access denied");
    }
    next();
}

// for supper admin
function authSupper(req, res, next) {
    const token = req.cookies["supper-token"];
    if (!token) {
        return res.status(400).send("Access Denied, No token Provided!");
    }
    try {
        const decode = jwt.verify(token, process.env.SUPPER_ADMIN_KEY);
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}

function supperAdmin(req, res, next) {
    if (!req.user.supperAdmin) {
        return res.status(403).send("Access denied");
    }
    next();
}

module.exports = {
    authAdmin, admin,
    authCustomer, customer,
    authSupplier, supplier,
    authSupper, supperAdmin
};