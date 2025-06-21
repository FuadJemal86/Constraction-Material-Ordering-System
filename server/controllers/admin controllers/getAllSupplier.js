const prisma = require("../../prismaCliaynt")

const getTotalSupplier = async (req, res) => {
    try {
        const totalSupplier = await prisma.supplier.count()

        if (totalSupplier === 0) {
            return res.status(400).json({ status: false, message: 'no supplier  found' })
        }

        return res.status(200).json({ status: true, totalSupplier })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getTotalSupplier }