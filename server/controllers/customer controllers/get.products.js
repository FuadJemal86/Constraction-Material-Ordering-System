const prisma = require("../../prismaCliaynt");


// get supplier products



const getProduct = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const categoryId = parseInt(req.query.category)

    console.log(categoryId)
    try {

        const chekSupplier = await prisma.supplier.findFirst({
            where: { id: id },

            select: {
                isActive: true,
                isApproved: true
            }
        })

        if (!chekSupplier.isActive || !chekSupplier.isApproved) {
            return res.status(400).json({ status: false, message: 'No supplier founded' });
        }

        const product = await prisma.product.findMany({
            where: {
                supplierId: id,
                categoryId: categoryId,
                stock: {
                    gt: 0, // gt means "greater than"
                },
            },
        });

        if (product.length == 0) {
            return res.status(401).json({ status: false, message: "No product found" })
        }

        return res.status(200).json({ status: true, product })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { getProduct }