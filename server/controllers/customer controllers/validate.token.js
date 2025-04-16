// validate the token

const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {

    const token = req.cookies["x-auth-token"];

    if (!token) {
        return res.status(401).json({ valid: false, message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.CUSTOMER_KEY);
        req.customer = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ valid: false, message: "Invalid or expired token!" });
    }
};

const verifyCustomerToken =  [verifyToken, async (req, res) => {
    try {
        const user = await prisma.customer.findUnique({
            where: { id: req.customer.id }
        });

        if (!user) {
            return res.status(401).json({ valid: false, message: "User not found" });
        }

        res.status(200).json({ valid: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ valid: false, message: "Server error" });
    }
}]

module.exports = {verifyCustomerToken}