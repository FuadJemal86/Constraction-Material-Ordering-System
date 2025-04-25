const prisma = require("../../prismaCliaynt")
const jwt = require('jsonwebtoken')


const supplierVerify = async (req, res) => {

    const token = req.cookies['s-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provide' })
    }

    const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)

    const supplierId = decoded.id

    try {
        const isVerifiy = await prisma.supplier.findFirst({
            where: { id: supplierId },

            select: {
                isVerify: true
            }
        })

        const supplierVerifiy = isVerifiy.isVerify

        return res.status(200).json({ status: true, supplierVerifiy })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }

}

module.exports = { supplierVerify }