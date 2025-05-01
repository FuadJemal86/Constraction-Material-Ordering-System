
// get supplier 

const prisma = require("../../prismaCliaynt");

const removedSupplier = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const [suppliers, totalSuppliers] = await Promise.all([
            prisma.supplier.findMany({
                where: { isActive: false },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    phone: true,
                    companyName: true,
                    email: true,
                    createdAt: true,
                    address: true,
                    tinNumber: true,
                    licenseNumber: true,
                    isApproved: true
                }
            }),
            prisma.supplier.count()
        ]);

        if (suppliers.length === 0) {
            return res.status(404).json({ status: false, message: 'No suppliers found' });
        }

        return res.status(200).json({
            status: true,
            result: suppliers,
            totalPages: Math.ceil(totalSuppliers / limit),
            currentPage: page
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
}

module.exports = { removedSupplier }