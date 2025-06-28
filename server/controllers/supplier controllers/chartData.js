const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken')


const chartData = async (req, res) => {

    const token = req.cookies['s-auth-token'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided. Please login first.'
        });
    }
    let decoded
    try {
        decoded = jwt.verify(token, process.env.SUPPLIER_KEY);

        const orders = await prisma.order.findMany({
            where: { supplierId: Number(decoded.id) },
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