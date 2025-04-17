const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')

const getCustomerPaymentStatus = async (req, res) => {
    const token = req.cookies['t-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provide' })
    }

    const decoded = jwt.verify(token, process.env.CUSTOMER_KEY)

    const customerId = parseInt(decoded.id)

    try {
        const order = await prisma.order.findMany({
            where: { customerId: customerId },

            select: {
                transactionId: true
            }
        })


        const payment = await prisma.payment.findMany({
            where: { transactionId: order.transactionId }
        })

        return res.status(200).json({ status: true, payment })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = {getCustomerPaymentStatus}