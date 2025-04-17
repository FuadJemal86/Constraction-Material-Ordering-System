const prisma = require("../../prismaCliaynt")



const getCustomerOrderItem = async (req, res) => {
    const {id} = parseInt(req.params)


    try {
        const orderItem = await prisma.orderitem.findMany({
            where: { orderId: id },
            include : {
                product: true
            }
        })

        return res.status(200).json({ status: true, orderItem })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getCustomerOrderItem }