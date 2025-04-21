

// update supplier

const prisma = require("../../prismaCliaynt");

const updatedSupplier =  async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, email, phone, address, tinNumber, licenseNumber, password } = req.body;


        const updatedSupplier = await prisma.supplier.update({
            where: { id: Number(id) },
            data: { companyName, email, phone, address, tinNumber, licenseNumber, password }
        });

        return res.status(200).json({ status: true, message: 'Supplier updated successfully!' });

    } catch (err) {
        console.error('Error updating supplier:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
}

module.exports = {updatedSupplier}