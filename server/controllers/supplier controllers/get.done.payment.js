const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')

const donePayment = async (req, res) => {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * 10

    const token = req.cookies['s-auth-token']

    if (!token) {
        return res.status(401).json({ status: false, message: 'token not provide' })
    }

    let supplierId

    try {
        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)
        supplierId = parseInt(decoded.id)
    } catch (err) {
        console.log(err)
        return res.status(401).json({ status: false, message: 'unverify token' })
    }

    try {
        const [orders] = await prisma.$transaction([
            prisma.order.findMany({
                where: { supplierId: supplierId },
                select: {
                    transactionId: true,
                    totalPrice: true,
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            phone: true
                        }
                    }
                }
            })
        ]);

        const transactionIds = orders.map(o => o.transactionId);

        const [actualPayments, totalPayment] = await Promise.all([
            prisma.payment.findMany({

                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                where: {
                    status: 'COMPLETED',
                    transactionId: { in: transactionIds }
                }
            }),
            prisma.payment.count({
                where: { transactionId: { in: transactionIds } }
            })
        ]);

        if (actualPayments == 0) {
            return res.status(400).json({ status: false, message: 'payment not found' })
        }

        const transactionToCustomerMap = {};
        orders.forEach(o => {
            transactionToCustomerMap[o.transactionId] = o.customer;
        });

        const enrichedPayments = actualPayments.map(payment => ({
            ...payment,
            customer: transactionToCustomerMap[payment.transactionId] || null
        }));

        return res.status(200).json({
            status: true,
            payments: enrichedPayments,
            totalPages: Math.ceil(totalPayment / limit),
            currentPage: page,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { donePayment }