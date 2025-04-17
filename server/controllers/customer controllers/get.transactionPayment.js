const prisma = require("../../prismaCliaynt")


const getTransactionPayment = async (req, res) => {
    const transactionId = req.params.transactionId

    console.log(transactionId)

    try {
        const paymentTransaction = await prisma.orderitem.findMany({
            where: {
                order: {
                    transactionId: transactionId
                }
            },
            select: {
                id: true,
                subtotal: true,
                quantity: true,
                unitPrice: true,
                product: true,
                order: {
                    select: {
                        createdAt: true,
                        id: true,
                        customer: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })


        return res.status(200).json({ status: true, paymentTransaction , transactionId })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Server error" });
    }
}

module.exports = { getTransactionPayment }