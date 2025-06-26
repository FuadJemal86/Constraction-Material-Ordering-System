const prisma = require("../../prismaCliaynt");

const categoryColors = {
    Electronics: '#3B82F6',
    Clothing: '#10B981',
    'Home & Garden': '#F59E0B',
    Sports: '#EF4444',
    Books: '#8B5CF6',
    Others: '#6B7280'
};

const piChartData = async (req, res) => {
    try {
        const productData = await prisma.orderitem.findMany({
            where: {
                order: {
                    status: 'SHIPPED'
                }
            },
            include: {
                product: {
                    include: {
                        category: true
                    }
                },
                order: true
            }
        });

        if (!productData || productData.length === 0) {
            return res.status(400).json({ status: false, message: 'Orders not found' });
        }

        // Aggregate sales by category
        const categorySalesMap = {};

        for (const item of productData) {
            const categoryName = item.product.category?.category || 'Others';

            if (!categorySalesMap[categoryName]) {
                categorySalesMap[categoryName] = 0;
            }

            categorySalesMap[categoryName] += item.quantity || 1;
        }

        // Build final response
        const topProductsData = Object.entries(categorySalesMap).map(([name, sales]) => ({
            name,
            sales,
            color: categoryColors[name] || categoryColors['Others']
        }));

        return res.status(200).json({ status: true, topProductsData });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { piChartData };
