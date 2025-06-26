const prisma = require("../../prismaCliaynt")
const jwt = require('jsonwebtoken')

const pendingOrder = async (req, res) => {
    const token = req.cookies['s-auth-token'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided. Please login first.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY);

        const pendingOrder = await prisma.order.count({
            where: { supplierId: Number(decoded.id), status: 'PENDING' }
        });

        return res.status(200).json({ status: true, pendingOrder });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
}

module.exports = { pendingOrder }
