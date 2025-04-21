

// delete customer

const prisma = require("../../prismaCliaynt")

const deleteCustomer =  async (req, res) => {

    try {
        const { id } = req.params

        await prisma.customer.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'customer deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}


module.exports = {deleteCustomer}