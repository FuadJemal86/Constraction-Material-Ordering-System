const prisma = require("../../prismaCliaynt")
const jwt = require('jsonwebtoken')


const totalCustomer = async (req, res) => {
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

        const totalCustomer = await prisma.order.count({
            where: { supplierId: Number(decoded.id), status: 'SHIPPED' },
        })

        if (totalCustomer === 0) {
            return res.status(400).json({ status: false, message: 'no customer found' })
        }

        return res.status(200).json({ status: true, totalCustomer })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { totalCustomer }