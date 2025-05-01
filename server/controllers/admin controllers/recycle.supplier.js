



// delete supplier

const prisma = require("../../prismaCliaynt");

const recycleSupplier = async (req, res) => {

    const id = parseInt(req.params.id)

    try {

        const existingSupplier = await prisma.supplier.findFirst({
            where: { id: id }
        });

        if (!existingSupplier) {
            return res.status(404).json({ status: false, message: 'Supplier not found' });
        }

        await prisma.supplier.update({
            where: { id: id },

            data: {
                isActive: true
            }
        })

        return res.status(200).json({ status: true, message: 'supplier recycle successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { recycleSupplier }