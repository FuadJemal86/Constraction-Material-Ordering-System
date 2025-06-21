const prisma = require("../../prismaCliaynt");

const getAllCategory = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                category: true
            }
        });

        if (categories.length === 0) {
            return res.status(400).json({ status: false, message: 'No category found' });
        }

        const categoryWithTotal = await Promise.all(
            categories.map(async (cat) => {
                const productSum = await prisma.product.aggregate({
                    where: { categoryId: cat.id },
                    _sum: { price: true }
                });

                return {
                    id: cat.id,
                    category: cat.category,
                    totalPrice: productSum._sum.price || 0
                };
            })
        );

        return res.status(200).json({ status: true, categoryWithTotal });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { getAllCategory };
