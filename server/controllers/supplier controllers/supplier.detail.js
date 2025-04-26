const prisma = require("../../prismaCliaynt")


const supplierData = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const supplierData = await prisma.supplierVerifiy.findUnique({
            where: { supplierId: id }
        })

        return res.status(200).json({ status: true, supplierData })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }

}

module.exports = { supplierData }