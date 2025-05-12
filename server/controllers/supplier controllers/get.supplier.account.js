const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')

const supplierProfile = async (req, res) => {
    const token = req.cookies['s-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provide' })
    }
    let adminId
    try {
        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)
        supplierId = decoded.id
    } catch (err) {
        console.log(err)
        return res.status(401).json({ status: false, message: 'expired or invalid token' })
    }

    try {
        const supplierPofile = await prisma.supplier.findFirst({
            where: { id: Number(supplierId) },

            select: {
                companyName: true,
                email: true,
                password: true,
                image: true,
                id: true,
                createdAt: true
            }
        })

        return res.status(200).json({ status: true, supplierPofile })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}


module.exports = { supplierProfile }