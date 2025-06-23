const prisma = require("../../prismaCliaynt")

const totalOrder = async (req, res) => {
    try {
        const totalOrder = await prisma.order.count({})

        if (totalOrder === 0) {
            return res.status(400).json({ status: false, message: 'no order  found' })
        }

        return res.status(200).json({ status: true, totalOrder })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { totalOrder }