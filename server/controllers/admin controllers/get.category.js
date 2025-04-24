

// get categorys

const prisma = require("../../prismaCliaynt")

const getCategory = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    try {

        const [category, totalCategory] = await Promise.all([
            await prisma.category.findMany({
                skip,
                take: limit,
                orderBy: { id: 'asc' }
            }),
            prisma.category.count()
        ])

        return res.status(200).json({
            status: true,
            result: category,
            totalPages: Math.ceil(totalCategory / limit),
            currentPage: page
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { getCategory }