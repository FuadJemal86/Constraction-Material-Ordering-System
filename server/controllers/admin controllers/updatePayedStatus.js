

const prisma = require("../../prismaCliaynt")


const updatePayedStatus = async (req, res) => {
    const { id } = req.params
    const { payedStatus } = req.body

    try {
        await prisma.payment.update({
            where: { id: parseInt(id) },
            data: {
                payedStatus: payedStatus
            }
        })

        return res.status(200).json({ status: true, message: `The Payment Is ${payedStatus}` })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { updatePayedStatus }