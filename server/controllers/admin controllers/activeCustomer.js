const prisma = require("../../prismaCliaynt")


const getActiveCustomer = async (req, res) => {
    try {
        const activeCustomer = await prisma.customer.count({
            where: { isActive: true }
        })

        if (activeCustomer === 0) {
            return res.status(400).json({ status: false, message: 'no active customer  found' })
        }

        return res.status(200).json({ status: true, activeCustomer })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getActiveCustomer }