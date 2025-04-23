


// get payment

const prisma = require("../../prismaCliaynt");

const getPayment = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const [orders, count] = await prisma.$transaction([
            prisma.order.findMany({
                select: {
                    totalPrice: true
                },
                include: {
                    supplier: {
                        select: {
                            id: true,
                            companyName: true,
                            phone: true,
                        },
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
            prisma.payment.count()
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

        const transactionMap = {};

        orders.forEach(o => {
            const txId = o.transactionId;

            if (!transactionMap[txId]) {
                transactionMap[txId] = {
                    totalPrice: o.totalPrice,
                    customer: o.customer,
                    supplier: o.supplier
                };
            } else {
                transactionMap[txId].totalPrice += o.totalPrice;
            }
        });


        const enrichedPayments = actualPayments.map(payment => ({
            ...payment,
            totalPrice: transactionMap[payment.transactionId]?.totalPrice || 0,
            customer: transactionMap[payment.transactionId]?.customer || null,
            supplier: transactionMap[payment.transactionId]?.supplier || null
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


module.exports = { getPayment }