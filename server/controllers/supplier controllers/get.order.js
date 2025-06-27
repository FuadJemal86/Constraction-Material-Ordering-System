// get order

const prisma = require("../../prismaCliaynt")
const jwt = require('jsonwebtoken')

const getOrder = async (req, res) => {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const token = req.cookies['s-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provide' })
    }

    const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)

    const supplierId = parseInt(decoded.id)

    try {
        const [order, orderCount] = await Promise.all([
            prisma.order.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                where: { supplierId: supplierId },

                include: {
                    customer: {
                        select: {
                            name: true,
                            phone: true
                        }
                    }
                }
            }),
            prisma.order.count({
                where: { supplierId: supplierId }
            })
        ])

        if (order == 0) {
            return res.status(400).json({
                status: false,
                message: 'order not found'
            })
        }

        return res.status(200).json({
            status: true,
            order,
            totalPages: Math.ceil(orderCount / limit),
            currentPage: page,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { getOrder }