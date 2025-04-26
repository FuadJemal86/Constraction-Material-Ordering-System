const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken')


const chekReviw = async (req, res) => {
    const token = req.cookies['s-auth-token']

    if (!token) {
        return res.status(400).json({ satus: false, message: 'no token provide' })
    }

    try {
        decoded = jwt.verify(token, process.env.SUPPLIER_KEY);
    } catch (error) {
        return res.status(401).json({ status: false, message: 'Invalid token' });
    }

    const supplierId = decoded.id

    try {
        const chekReviw = await prisma.supplierVerifiy.findUnique({
            where: { supplierId: supplierId },

            select: {
                isReviw: true
            }
        })

        const reviw = chekReviw.isReviw

        return res.status(200).json({ status: true, reviw })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
}

module.exports = { chekReviw }