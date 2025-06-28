const prisma = require("../../prismaCliaynt");


const getSystemPerformance = async (req, res) => {
    try {
        const now = new Date();
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);

        const logs = await prisma.payment.findMany({
            where: {
                createdAt: {
                    gte: oneWeekAgo,
                    lte: now
                }
            },
            select: {
                status: true,
                createdAt: true
            }
        });

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const performance = {};

        // Initialize default structure
        days.forEach(day => {
            performance[day] = {
                day,
                uptime: 100,
                transactions: 0,
                errors: 0
            };
        });

        logs.forEach(log => {
            const dayName = days[log.createdAt.getDay()];
            performance[dayName].transactions += 1;
            if (log.status === 'REJECTED') {
                performance[dayName].errors += 1;
            }
        });

        // Simulate uptime based on error count
        const finalData = Object.values(performance).map(day => {
            const { errors, transactions } = day;
            const uptime = transactions === 0
                ? 100
                : 100 - (errors / transactions) * 100;

            return {
                ...day,
                uptime: +uptime.toFixed(1) // e.g., 99.8
            };
        });

        return res.status(200).json({ status: true, finalData });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { getSystemPerformance };
