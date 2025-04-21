


// get payment

const prisma = require("../../prismaCliaynt");

const getPayment =  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const [orders, count] = await prisma.$transaction([
            prisma.order.findMany({
                include: {
                    supplier: {
                        select: {
                            id: true,
                            companyName: true,
                            phone: true
                        }
                    },
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            phone: true
                        }
                    }
                }
            }),
            prisma.payment.count() // total count for pagination
        ]);

        const transactionIds = orders.map(o => o.transactionId);

        const actualPayments = await prisma.payment.findMany({
            where: {
                transactionId: { in: transactionIds }
            },
            include: {
                bank: true,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (actualPayments.length === 0) {
            return res.status(400).json({ status: false, message: 'No payments found' });
        }

        const transactionToCustomerMap = {};
        const transactionToSupplierMap = {};
        orders.forEach(o => {
            transactionToCustomerMap[o.transactionId] = o.customer;
            transactionToSupplierMap[o.transactionId] = o.supplier;
        });

        const enrichedPayments = actualPayments.map(payment => ({
            ...payment,
            customer: transactionToCustomerMap[payment.transactionId] || null,
            supplier: transactionToSupplierMap[payment.transactionId] || null
        }));

        return res.status(200).json({
            status: true,
            payments: enrichedPayments,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalPayments: count
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
}


module.exports = {getPayment}