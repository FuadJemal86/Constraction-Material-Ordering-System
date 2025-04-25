

const prisma = require("../../prismaCliaynt")


const updatePaymentStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        await prisma.payment.update({
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

module.exports = { updatePaymentStatus }