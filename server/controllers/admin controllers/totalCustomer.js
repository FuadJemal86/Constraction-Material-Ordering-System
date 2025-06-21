const prisma = require("../../prismaCliaynt")

const getTotalCustomer = async (req, res) => {
    try {
        const totalCustomer = await prisma.customer.count({
            where: { isActive: true }
        })

        if (totalCustomer === 0) {
            return res.status(400).json({ status: false, message: 'no customer  found' })
        }

        return res.status(200).json({ status: true, totalCustomer })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getTotalCustomer }