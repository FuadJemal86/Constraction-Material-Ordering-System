

// delete customer

const prisma = require("../../prismaCliaynt")

const deleteCustomer = async (req, res) => {

    const  id  = parseInt(req.params.id)


    try {

        const isExist = await prisma.customer.findFirst({
            where: { id: id }
        })

        if (!isExist) {
            return res.status(400).json({ status: false, message: 'customer not found!' })
        }

        await prisma.customer.update({
            where: { id: id},

            data: {
                isActive: false
            }
        })

        return res.status(200).json({ status: true, message: 'customer deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}


module.exports = { deleteCustomer }