



// get customer

const prisma = require("../../prismaCliaynt")

const deletedCustomer = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 1
    const skip = (page - 1) * limit
    try {
        const [removedCustomer, totalCustomer] = await Promise.all([
            prisma.customer.findMany({
                where: { isActive: false },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.customer.count()
        ])

        if (supplier == 0) {
            return res.status(404).json({ status: false, message: 'customer not found' })
        }
        return res.status(200).json({
            status: true,
            result: removedCustomer,
            totalPages: Math.ceil(totalCustomer / limit),
            currentPage: page

        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { deletedCustomer }