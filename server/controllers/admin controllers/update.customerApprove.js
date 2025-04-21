


// update customer status

const prisma = require("../../prismaCliaynt");

const updateCustomerApprove =  async (req, res) => {
    const { supplierId } = req.params;
    const { isApproved } = req.body;

    try {
        const updatedSupplier = await prisma.supplier.update({
            where: { id: parseInt(supplierId) }, // Ensure ID is an integer
            data: { isApproved }, // Update the status
        });

        res.json({ status: true, message: "Supplier status updated successfully", result: updatedSupplier });
    } catch (error) {
        console.error("Error updating supplier status:", error);
        res.status(500).json({ status: false, message: "Failed to update supplier status" });
    }
}

module.exports = {updateCustomerApprove}