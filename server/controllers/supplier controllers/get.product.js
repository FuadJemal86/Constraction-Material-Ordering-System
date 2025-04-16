const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken')

const getProduct =  async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    console.log(page)

    const token = req.cookies['s-auth-token'];

    if (!token) {
        return res.status(401).json({ valid: false, message: "Unauthorized: No token provided" });
    }
    try {

        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)
        const supplierId = decoded.id

        console.log(supplierId)


        const [product, totalProduct] = await Promise.all([
            prisma.product.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                where: { supplierId: supplierId },
                include: { category: true }
            }),
            prisma.product.count()

        ]);

        return res.status(200).json({
            status: true,
            result: product,
            totalPages: Math.ceil(totalProduct / limit),
            currentPage: page,
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}


module.exports = {getProduct}