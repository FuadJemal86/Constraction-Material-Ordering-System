



// delete supplier

const prisma = require("../../prismaCliaynt");

const recycleCustomer = async (req, res) => {

    const id = parseInt(req.params.id)

    try {

        const existingcustomer = await prisma.customer.findFirst({
            where: { id: id }
        });

        if (!existingcustomer) {
            return res.status(404).json({ status: false, message: 'customer not found' });
        }

        await prisma.customer.update({
            where: { id: id },

            data: {
                isActive: true
            }
        })

        return res.status(200).json({ status: true, message: 'customer recycle successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { recycleCustomer }