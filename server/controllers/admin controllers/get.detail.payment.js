const prisma = require("../../prismaCliaynt");

const getPaymentDetali = async (req, res) => {
    const transactionId = req.params.transactionId;


    try {
        const orderDetails = await prisma.order.findMany({
            where: { transactionId },
            select: {
                totalPrice: true,
                transactionId: true,
                customer: {
                    select: {
                        name: true,
                        phone: true,
                    }
                },
                supplier: {
                    select: {
                        companyName: true,
                        phone: true,
                        bank: {
                            select: {
                                bankName: true,
                                account: true
                            }
                        }
                    }
                }
            }
        });

        const paymentInfo = await prisma.payment.findFirst({
            where: { transactionId },
            select: {
                id: true,
                bankTransactionId: true,
                image: true
            }
        });

        return res.status(200).json({
            status: true,
            paymentDetail: {
                orderDetails,
                paymentInfo
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { getPaymentDetali };
