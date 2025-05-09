const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')

const adminGetAccount = async (req, res) => {
    const token = req.cookies['a-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provide' })
    }
    let adminId
    try {
        const decoded = jwt.verify(token, process.env.ADMIN_PASSWORD)
        adminId = decoded.id
    } catch (err) {
        console.log(err)
        return res.status(401).json({ status: false, message: 'expired or invalid token' })
    }

    try {
        const adminProfil = await prisma.admin.findFirst({
            where: { id: Number(adminId) },

            select: {
                name: true,
                email: true,
                image: true,
                id: true,
                createdAt: true
            }
        })

        return res.status(200).json({ status: true, adminProfil })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}


module.exports = { adminGetAccount }