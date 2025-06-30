const prisma = require("../../prismaCliaynt");

const getSupplier = async (req, res) => {
    try {
        const supplier = await prisma.supplier.findMany({
            where: {
                isActive: true,
                isApproved: true
            },
            select: {
                id: true,
                companyName: true,
                phone: true,
                isApproved: true,
                address: true,
                isVerify: true,
                lat: true,
                lng: true

            }
        });

        if (!supplier || supplier.length === 0) {
            return res.status(404).json({ status: false, message: "No approved and active suppliers found" });
        }

        return res.status(200).json({ status: true, supplier });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { getSupplier };
