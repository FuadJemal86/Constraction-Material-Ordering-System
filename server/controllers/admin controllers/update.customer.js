

// update customer

const prisma = require("../../prismaCliaynt");

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone } = req.body;


        await prisma.customer.update({
            where: { id: Number(id) },
            data: { name, email, password, phone }
        });

        return res.status(200).json({ status: true, message: 'customer updated successfully!' });

    } catch (err) {
        console.error('Error updating supplier:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
}


module.exports = {updateCustomer}