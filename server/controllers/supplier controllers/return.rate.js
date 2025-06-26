const prisma = require("../../prismaCliaynt")
const jwt = require('jsonwebtoken')


const returnRate = async (req, res) => {
    const token = req.cookies['s-auth-token'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided. Please login first.'
        });
    }

    let decoded

    try {
        decoded = jwt.verify(token, process.env.SUPPLIER_KEY);

        const returnRate = await prisma.order.count({
            where: { supplierId: Number(decoded.id), status: 'CANCELLED' }
        })


        if (returnRate === 0) {
            return res.status(400).json({ status: false, message: 'no return order found' })
        }

        return res.status(200).json({ status: true, returnRate })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { returnRate }