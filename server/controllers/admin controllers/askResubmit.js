const prisma = require("../../prismaCliaynt")


const resubmit = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        await prisma.supplierVerifiy.update({
            where: { supplierId: id },

            data: {
                isReviw: false
            }
        })
        return res.status(200).json({ status: true, message: 'Update Succsessfuly!' })
    } catch (err) {
        console.log(err)
    }
}

module.exports = { resubmit }