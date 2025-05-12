const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')

const getAdminProfileImage = async (req, res) => {
    const token = req.cookies['s-auth-token']

    if (!token) {
        return res.status(401).json({ status: false, message: 'no token provide' })
    }

    let supplierId
    try {
        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)
        supplierId = decoded.id
    } catch (err) {
        console.log(err)
        return res.status(401).json({ status: false, message: 'invalid token' })
    }
    try {
        const supplierImage = await prisma.admin.findFirst({
            where: { id: Number(supplierId) },
            select: {
                image: true
            }
        })

        return res.status(200).json({ status: true, supplierImage })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getAdminProfileImage }