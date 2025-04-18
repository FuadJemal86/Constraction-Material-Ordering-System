const prisma = require("../../prismaCliaynt");


// get supplier products



const getProduct =  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const categoryId = parseInt(req.query.category)

    console.log(categoryId)
    try {

        const product = await prisma.product.findMany(
            {
                where: { supplierId: id  , categoryId:categoryId }
            })

        if (product.length == 0) {
            return res.status(401).json({ status: false, message: "No product found" })
        }

        return res.status(200).json({ status: true, product })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = {getProduct}