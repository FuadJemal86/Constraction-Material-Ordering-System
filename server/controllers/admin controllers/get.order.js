

// get order

const prisma = require("../../prismaCliaynt");

const getOrder =  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {

        const [order, totalSuppliers] = await Promise.all([

            prisma.order.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    supplier: true,
                    customer: {
                        select: {
                            name: true,
                            phone: true
                        }
                    }
                }
            }),
            prisma.order.count()
        ])

        if (order == 0) {
            return res.status(400).json({ status: false, message: 'order not found' })
        }

        return res.status(200).json({
            status: true,
            result: order,
            totalPages: Math.ceil(totalSuppliers / limit),
            currentPage: page
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = {getOrder}