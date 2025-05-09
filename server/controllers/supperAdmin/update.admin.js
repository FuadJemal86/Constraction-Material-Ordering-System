


// update customer

const prisma = require("../../prismaCliaynt");

const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;


        await prisma.admin.update({
            where: { id: Number(id) },
            data: { name, email }
        });

        return res.status(200).json({ status: true, message: 'admin updated successfully!' });

    } catch (err) {
        console.error('Error updating supplier:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
}


module.exports = { updateAdmin }