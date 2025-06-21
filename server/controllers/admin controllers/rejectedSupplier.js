const prisma = require("../../prismaCliaynt")


const getRejectedSupplier = async (req, res) => {
    try {
        const rejectedSupplier = await prisma.supplier.count({
            where: { isActive: false }
        })

        if (rejectedSupplier === 0) {
            return res.status(400).json({ status: false, message: 'no rejected supplier  found' })
        }

        return res.status(200).json({ status: true, rejectedSupplier })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getRejectedSupplier }