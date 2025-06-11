// update the status of order 

const prisma = require("../../prismaCliaynt")

const updateOrderStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        await prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                status: status
            }
        })

        res.status(200).json({ status: true, message: `order updated in to ${status}` })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, error: 'server error' })
    }

    try {
        if (status === 'PROCESSING') {
            // Step 1: Get quantities for each order item
            const orderItems = await prisma.orderitem.findMany({
                where: { orderId: Number(id) },
                select: {
                    productId: true,
                    quantity: true
                }
            });

            // Step 2: Loop through each item and update product stock
            for (const item of orderItems) {
                // Get current stock from product table
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: { stock: true }
                });

                if (!product) continue;

                const newStock = product.stock - item.quantity;

                const updatedStock = newStock >= 0 ? newStock : 0;

                // Update product stock
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: updatedStock }
                });
            }

            return res.status(200).json({
                status: true,
                message: "Stock updated based on order items"
            });
        }

        return res.status(400).json({ status: false, message: "Invalid status" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Server error" });
    }


}


module.exports = { updateOrderStatus }