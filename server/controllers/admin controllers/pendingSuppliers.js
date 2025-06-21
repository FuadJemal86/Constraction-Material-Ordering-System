const prisma = require("../../prismaCliaynt")


const getPendingSupplier = async (req, res) => {
    try {
        const pendingSupplier = await prisma.supplier.count({
            where: { isApproved: false, isActive: true }
        })

        if (pendingSupplier === 0) {
            return res.status(400).json({ status: false, message: 'no supplier  found' })
        }

        return res.status(200).json({ status: true, pendingSupplier })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getPendingSupplier }