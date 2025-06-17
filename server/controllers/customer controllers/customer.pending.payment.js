const prisma = require("../../prismaCliaynt");


const getPendingOrder = async (req, res) => {

    const { id } = req.params;

    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            select: {
                transactionId: true
            }
        })

        if (!order) {
            return res.status(400).json({ status: false, message: 'order not found' })
        }

        const { transactionId } = order

        const pendingSatus = await prisma.payment.findUnique({
            where: { transactionId: transactionId, status: 'PENDING' },
            select: {
                status: true
            }
        })

        return res.status(200).json({ status: true, message: pendingSatus })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: "Server error" });
    }

}


module.exports = { getPendingOrder }