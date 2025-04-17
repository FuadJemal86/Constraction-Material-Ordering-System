const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')

const getProfile = async (req, res) => {
    const token = req.cookies['x-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provide' })
    }

    const decoded = jwt.verify(token, process.env.CUSTOMER_KEY)

    const id = parseInt(decoded.id)

    try {
        const customer = await prisma.customer.findFirst({
            where: { id: id },

            select: {
                image: true
            }
        })
        return res.status(200).json({ status: true, customer })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = {getProfile}