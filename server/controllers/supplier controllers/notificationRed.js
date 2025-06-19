const prisma = require("../../prismaCliaynt")


const notificationRed = async (req, res) => {
    const { id } = req.params

    try {
        const notificationRed = await prisma.message.update({
            where: { id: Number(id) },

            data: {
                suppliermrRed: true
            }
        })

        if (!notificationRed) {
            return res.status(400).json({ status: false, message: 'not founded' })
        }

        return res.status(200).json({ status: true, message: 'notification marked as read' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { notificationRed }