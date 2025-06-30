const prisma = require("../../prismaCliaynt");


const deleteCustomers = async (req, res) => {
    const customerId = Number(req.params.id);

    try {
        const customerOrder = await prisma.order.findMany({
            where: { customerId },
            select: { id: true, status: true }
        });



        const orderIds = customerOrder.map(order => order.id);

        // 3. Delete order items for these orders
        await prisma.orderitem.deleteMany({
            where: { orderId: { in: orderIds } }
        });

        // 4. Delete the orders
        await prisma.order.deleteMany({
            where: { customerId }
        });

        // 6. Delete messages
        await prisma.message.deleteMany({
            where: {
                OR: [
                    { senderId: Number(customerId) },
                    { receiverId: Number(customerId) }
                ]
            }
        });

        // delete customer payment

        const transactionIdd = await prisma.transaction.findMany({
            where: { customerId },
            select: {
                transactionId: true
            }
        })

        const paymentId = transactionIdd.map(paymentId => paymentId.transactionId)

        await prisma.payment.deleteMany({
            where: { transactionId: { in: paymentId } }
        });

        // 7. Delete customerTransaction (if exists)
        await prisma.transaction.deleteMany({
            where: { customerId }
        });

        // 8. Finally delete the customer
        await prisma.customer.delete({
            where: { id: customerId }
        });

        return res.status(200).json({
            status: true,
            message: 'customer and all related data deleted successfully.'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            error: 'Server error'
        });
    }
}


module.exports = { deleteCustomers }