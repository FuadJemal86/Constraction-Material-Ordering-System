
const jwt = require('jsonwebtoken')
const prisma = require("../../prismaCliaynt")


// get customer transitionId from cookies

const customerGetTransaction =  async (req, res) => {
    const token = req.cookies['x-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: "login first" })
    }

    const decoded = jwt.verify(token, process.env.CUSTOMER_KEY)

    const customerId = parseInt(decoded.id, 10)


    try {
        const transactionId = await prisma.order.findMany({
            where: {
                customerId: customerId,
                status: 'PENDING'
            },
            select: {
                status: true,
                transactionId: true
            }
        })

        const pendingCount = await prisma.order.count({
            where: {
                customerId: customerId,
                status: 'PENDING'
            }
        });

        return res.status(200).json({ status: true, result: transactionId, count: pendingCount })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Server error" });
    }
}


module.exports = {customerGetTransaction}