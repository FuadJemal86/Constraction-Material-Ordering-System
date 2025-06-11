const prisma = require("../../prismaCliaynt");

const getProductStock = async (req, res) => {
    let productIds = req.query.productIds?.split(',') || [];

    // Convert all productIds to integers
    productIds = productIds.map(id => parseInt(id)).filter(id => !isNaN(id));


    try {
        const getStock = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            select: {
                id: true,
                stock: true,
            },
        });

        if (!getStock || getStock.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Stock not found for the provided product(s)",
            });
        }

        return res.status(200).json({
            status: true,
            data: getStock,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            message: "Server error",
        });
    }
};

module.exports = { getProductStock };
