// update the status of order 

const prisma = require("../../prismaCliaynt")

const updateOrderStatus =  async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        await prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                status: status
            }
        })

        return res.status(200).json({ status: true, message: `order updated in to ${status}` })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}


module.exports = {updateOrderStatus}