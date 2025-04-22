const prisma = require("../../prismaCliaynt");

const orderdelete = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const isExist = await prisma.order.findFirst({
            where: { id: id }
        });

        if (!isExist) {
            return res.status(400).json({ status: false, message: 'Order not found!' });
        }

        await prisma.orderitem.deleteMany({
            where: { orderId: id }
        });

        await prisma.order.delete({
            where: { id: id }
        });

        return res.status(200).json({ status: true, message: 'Order deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { orderdelete };
