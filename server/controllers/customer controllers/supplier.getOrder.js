const jwt = require('jsonwebtoken');
const prisma = require('../../prismaCliaynt');

const getCustomerOrder = async (req, res) => {
    const token = req.cookies['x-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provid' })
    }

    const decoded = jwt.verify(token, process.env.CUSTOMER_KEY)

    const customerId = parseInt(decoded.id)

    try {
        const order = await prisma.order.findMany({
            where: { customerId: customerId },

            select: {
                supplier: {
                    select: {
                        companyName: true,
                        phone: true
                    }
                },
                supplierId: true,
                id: true,
                customer: true,
                totalPrice: true,
                deliveryOption: true,
                transactionId: true,
                createdAt: true,
                status: true
            }
        })

        return res.status(200).json({ status: true, order })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getCustomerOrder }