

// delete supplier

const prisma = require("../../prismaCliaynt");

const deleteSupplier =  async (req, res) => {

    try {
        const { id } = req.params

        const existingSupplier = await prisma.supplier.findUnique({
            where: { id: Number(id) }
        });

        if (!existingSupplier) {
            return res.status(404).json({ status: false, message: 'Supplier not found' });
        }

        await prisma.supplier.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'supplier deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = {deleteSupplier}