const prisma = require("../../prismaCliaynt")
const jwt = require('jsonwebtoken')


const totalProduct = async (req, res) => {
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

        const totalProduct = await prisma.product.count({
            where: { supplierId: Number(decoded.id) }
        })


        if (totalProduct === 0) {
            return res.status(400).json({ status: false, message: 'no product found' })
        }

        return res.status(200).json({ status: true, totalProduct })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { totalProduct }