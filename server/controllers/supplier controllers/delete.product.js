// delete product

const prisma = require("../../prismaCliaynt")


const deleteProduct = async (req, res) => {
    const id = req.params.id

    try {
        const isOrdered = await prisma.orderitem.findMany({
            where: { productId: Number(id) }
        })

        if (isOrdered.length > 0) {
            return res.status(200).json({ status: false, message: 'This product already order by customer' })
        }

        await prisma.product.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'product deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { deleteProduct }