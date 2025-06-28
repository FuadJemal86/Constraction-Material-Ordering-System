const jwt = require('jsonwebtoken');
const prisma = require('../../prismaCliaynt');

const getCustomerPaymentStatus = async (req, res) => {
    const token = req.cookies['x-auth-token'];

    if (!token) {
        return res.status(400).json({ status: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.CUSTOMER_KEY);
        const customerId = parseInt(decoded.id);

        const orders = await prisma.order.findMany({
            where: { customerId },
            select: {
                transactionId: true,
                supplier: {
                    select: {
                        companyName: true,
                        phone: true
                    }
                }
            }
        });

        const transactionIds = orders.map(order => order.transactionId);

        const payments = await prisma.payment.findMany({
            where: {
                transactionId: {
                    in: transactionIds
                }
            }
        });

        const payment = payments.map(payment => {
            const matchingOrder = orders.find(order => order.transactionId === payment.transactionId);
            return {
                ...payment,
                supplier: matchingOrder?.supplier || null
            };
        });

        return res.status(200).json({ status: true, payment });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { getCustomerPaymentStatus };
