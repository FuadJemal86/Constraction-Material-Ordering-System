const prisma = require("../../prismaCliaynt")


const getTransactionPayment = async (req, res) => {
    const { transaction } = req.params

    try {
        const order = await prisma.order.findMany({
            where: { transactionId: transaction },

            select: {
                id: true
            }
        })

        const paymentTransaction = await prisma.orderitem.findMany({
            where: { orderId: order.id },
            select: {
                id: true,
                subtotal: true,
                quantity: true,
                unitPrice: true,
                product: true
            }
        })

        return res.status(200).json({ status: true, paymentTransaction })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Server error" });
    }
}

module.exports = {getTransactionPayment}