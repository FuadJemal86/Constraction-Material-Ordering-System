const prisma = require("../../prismaCliaynt");

const deleteProduct = async (req, res) => {
    const id = Number(req.params.id);

    try {
        // 1. Get all orderItems linked to this product
        const relatedOrderItems = await prisma.orderitem.findMany({
            where: { productId: id },
            select: { orderId: true }
        });

        const orderIds = [...new Set(relatedOrderItems.map(item => item.orderId))];

        // 2. Check if any of these orders are PROCESSING
        for (const orderId of orderIds) {
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                select: { status: true }
            });

            if (order && order.status === 'PROCESSING') {
                return res.status(400).json({
                    status: false,
                    message: 'Cannot delete product. Related order is still processing.'
                });
            }

        }

        // 3. Delete orderItems with this productId
        await prisma.orderitem.deleteMany({
            where: { productId: id }
        });

        // 4. Delete any empty orders
        for (const orderId of orderIds) {
            const remainingItems = await prisma.orderitem.findMany({
                where: { orderId }
            });

            if (remainingItems.length === 0) {
                await prisma.order.delete({
                    where: { id: orderId }
                });
            }
        }

        // 5. Now delete the product
        await prisma.product.delete({
            where: { id }
        });

        return res.status(200).json({
            status: true,
            message: 'Product and all related data deleted successfully.'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            error: 'Server error'
        });
    }
};

module.exports = { deleteProduct };
