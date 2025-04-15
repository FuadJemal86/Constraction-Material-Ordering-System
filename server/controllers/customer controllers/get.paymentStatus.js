// get payment status

const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken')

const getCustomerPayment = async (req, res) => {
    const token = req.cookies['x-auth-token'];

    if (!token) {
        return res.status(401).json({ valid: false, message: "login first" });
    }

    let customerId;
    try {
        const decoded = jwt.verify(token, process.env.CUSTOMER_KEY);
        customerId = parseInt(decoded.id, 10);
    } catch (err) {
        return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    try {

        const [orders, payments] = await prisma.$transaction([
            prisma.order.findMany({
                where: { customerId },
                select: { id: true, transactionId: true, status: true, totalPrice: true }
            }),
            prisma.payment.findMany({
                where: {
                    transactionId: {
                        in: (await prisma.order.findMany({
                            where: { customerId },
                            select: { id: true, transactionId: true, status: true, totalPrice: true }
                        })).map(order => order.transactionId)
                    }
                },
                select: {
                    transactionId: true,
                    status: true
                }
            })
        ]);

        if (orders.length === 0) {
            return res.status(400).json({ status: false, message: 'No orders found' });
        }

        return res.status(200).json({
            status: true,
            orders,
            paymentStatuses: payments
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};


module.exports = {getCustomerPayment}
