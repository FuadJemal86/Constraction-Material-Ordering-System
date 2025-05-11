const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')

const getAdminProfileImage = async (req, res) => {
    const token = req.cookies['a-auth-token']

    if (!token) {
        return res.status(401).json({ status: false, message: 'no token provide' })
    }

    let adminId
    try {
        const decoded = jwt.verify(token, process.env.ADMIN_PASSWORD)
        adminId = decoded.id
    } catch (err) {
        console.log(err)
        return res.status(401).json({ status: false, message: 'invalid token' })
    }
    try {
        const adminImage = await prisma.admin.findFirst({
            where: { id: Number(adminId) },
            select: {
                image: true
            }
        })

        return res.status(200).json({ status: true, adminImage })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getAdminProfileImage }