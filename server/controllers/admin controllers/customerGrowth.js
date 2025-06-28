const prisma = require("../../prismaCliaynt");

const getCustomerStats = async (req, res) => {
    try {
        const allCustomers = await prisma.customer.findMany({
            select: {
                createdAt: true,
                isActive: true
            }
        });

        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const stats = months.map((month, index) => {
            const newCustomers = allCustomers.filter(
                c => c.createdAt.getMonth() === index
            );

            const churnedCustomers = allCustomers.filter(
                c =>
                    !c.isActive &&
                    c.createdAt.getMonth() <= index
            );

            const activeCustomers = allCustomers.filter(
                c =>
                    c.createdAt.getMonth() <= index &&
                    c.isActive
            );

            return {
                month,
                new: newCustomers.length,
                active: activeCustomers.length,
                churned: churnedCustomers.length
            };
        });

        return res.status(200).json({ status: true, stats });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { getCustomerStats };
