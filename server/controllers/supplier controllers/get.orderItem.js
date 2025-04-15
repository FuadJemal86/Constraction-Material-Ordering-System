// get order item

const prisma = require("../../prismaCliaynt");

const getOrderItem =  async (req, res) => {

    const { id } = parseInt(req.params)


    try {
        const orderItem = await prisma.orderitem.findMany({
            where: {
                id: id,
            },
            include: {
                order: {
                    include: {
                        customer: true,
                    },
                },
                product: {
                    select: {
                        name: true,
                        category: true,
                    },
                },
            },
        });

        return res.status(200).json({ status: true, orderItem });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
}


module.exports = {getOrderItem}