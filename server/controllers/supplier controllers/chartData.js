const prisma = require("../../prismaCliaynt");


const chartData = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            select: {
                totalPrice: true,
                customerId: true,
                createdAt: true
            }
        });

        // Then use JS to group by month manually
        const monthlyData = {};

        orders.forEach(order => {
            const month = order.createdAt.toLocaleString('default', { month: 'short' });

            if (!monthlyData[month]) {
                monthlyData[month] = { month, revenue: 0, orders: 0, customers: new Set() };
            }

            monthlyData[month].revenue += order.totalPrice;
            monthlyData[month].orders += 1;
            monthlyData[month].customers.add(order.customerId);
        });

        // Convert Set to number and turn object to array
        const result = Object.values(monthlyData).map(m => ({
            ...m,
            customers: m.customers.size
        }));

        return res.status(200).json({ status: true, result })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}


module.exports = { chartData }