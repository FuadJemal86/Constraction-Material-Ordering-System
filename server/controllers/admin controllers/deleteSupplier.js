const prisma = require("../../prismaCliaynt");

const deleteSuppliers = async (req, res) => {
    const supplierId = Number(req.params.id);

    try {
        // 1. Get all orders by this supplier
        const supplierOrders = await prisma.order.findMany({
            where: { supplierId },
            select: { id: true, status: true }
        });



        const orderIds = supplierOrders.map(order => order.id);

        // 3. Delete order items for these orders
        await prisma.orderitem.deleteMany({
            where: { orderId: { in: orderIds } }
        });

        // 4. Delete the orders
        await prisma.order.deleteMany({
            where: { supplierId }
        });

        // 5. Delete related bank info
        await prisma.bank.deleteMany({
            where: { supplierId }
        });

        // 6. Delete messages
        await prisma.message.deleteMany({
            where: {
                OR: [
                    { senderId: Number(supplierId) },
                    { receiverId: Number(supplierId) }
                ]
            }
        });

        // 7. Delete supplierVerification (if exists)
        await prisma.supplierVerifiy.deleteMany({
            where: { supplierId }
        });

        // 8. Finally delete the supplier
        await prisma.supplier.delete({
            where: { id: supplierId }
        });

        return res.status(200).json({
            status: true,
            message: 'Supplier and all related data deleted successfully.'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            error: 'Server error'
        });
    }
};

module.exports = { deleteSuppliers };
