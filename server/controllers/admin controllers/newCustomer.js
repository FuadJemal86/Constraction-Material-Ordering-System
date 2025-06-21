const prisma = require("../../prismaCliaynt");

const getNewCustomer = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const newCustomer = await prisma.customer.count({
            where: {
                isActive: true,
                createdAt: {
                    gte: startOfMonth,
                    lt: startOfNextMonth
                }
            }
        })

        return res.status(200).json({ status: true, newCustomer });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { getNewCustomer };
