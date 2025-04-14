// delete product

const prisma = require("../../prismaCliaynt")

const deleteProduct = async (req, res) => {


    try {
        const { id } = req.params

        await prisma.product.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'product deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = {deleteProduct}