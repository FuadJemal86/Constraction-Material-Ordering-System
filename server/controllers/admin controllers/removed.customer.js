
// get supplier 

const prisma = require("../../prismaCliaynt");

const removedCustomer = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const [customer, totalCustomer] = await Promise.all([
            prisma.customer.findMany({
                where: { isActive: false },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true
                }
            }),
            prisma.supplier.count()
        ]);

        if (customer.length === 0) {
            return res.status(404).json({ status: false, message: 'No customer found' });
        }

        return res.status(200).json({
            status: true,
            result: customer,
            totalPages: Math.ceil(totalCustomer / limit),
            currentPage: page
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
}

module.exports = { removedCustomer }