const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken');

const getCustomerAccount = async (req, res) => {
    const token = req.cookies['x-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provide' })
    }
    const decoded = jwt.verify(token, process.env.CUSTOMER_KEY)

    const customerId = parseInt(decoded.id)

    try {
        const user = await prisma.customer.findMany({
            where: { id: customerId }
        })

        return res.status(200).json({ status: true, user })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getCustomerAccount }