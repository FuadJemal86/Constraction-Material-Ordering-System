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
                supplier: true
            }
        });

        const transactionIds = orders.map(order => order.transactionId);

        if (transactionIds.length === 0) {
            return res.status(200).json({ status: true, payment: [], supplier: null });
        }

        const payments = await prisma.payment.findMany({
            where: {
                transactionId: {
                    in: transactionIds
                }
            },
            include: {
                transaction: {
                    include: {
                        order: {
                            include: {
                                supplier: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).json({ status: true, payment: payments });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { getCustomerPaymentStatus };
