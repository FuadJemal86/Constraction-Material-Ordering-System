

// place order

const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const customerPlaceOrder =  async (req, res) => {
    const token = req.cookies["x-auth-token"];

    if (!token) {
        return res.status(401).json({ valid: false, message: "Login first" });
    }

    let customerId;
    try {
        const decoded = jwt.verify(token, process.env.CUSTOMER_KEY);
        customerId = parseInt(decoded.id, 10);
    } catch (err) {
        return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    try {
        const { address, latitude, longitude, deliveryOption, products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ status: false, message: "Invalid cart data" });
        }

        // Group products by supplierId
        const productsBySupplier = {};
        products.forEach(p => {
            const supplierId = p.supplierId;
            if (!productsBySupplier[supplierId]) {
                productsBySupplier[supplierId] = [];
            }
            productsBySupplier[supplierId].push(p);
        });

        const createdOrders = [];

        for (const [supplierId, groupProducts] of Object.entries(productsBySupplier)) {
            const totalPrice = groupProducts.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);
            const transactionId = uuidv4();

            const orderItems = [];

            for (const p of groupProducts) {
                const productId = parseInt(p.productId, 10);
                const quantity = parseInt(p.quantity, 10);
                const unitPrice = parseFloat(p.unitPrice);

                if (!productId || !quantity || isNaN(unitPrice)) {
                    return res.status(400).json({ status: false, message: "Invalid product data in cart" });
                }

                orderItems.push({
                    product: {
                        connect: { id: productId }
                    },
                    quantity,
                    unitPrice,
                    subtotal: quantity * unitPrice,
                });
            }

            const newOrder = await prisma.order.create({
                data: {
                    customer: {
                        connect: { id: customerId }
                    },
                    supplier: {
                        connect: { id: parseInt(supplierId, 10) }
                    },
                    address,
                    latitude,
                    longitude,
                    deliveryOption,
                    totalPrice,
                    transactionId,
                    orderitem: {
                        create: orderItems
                    }
                },
                include: { orderitem: true },
            });

            createdOrders.push({
                customer: newOrder.customerId,
                supplierId: newOrder.supplierId,
                totalPrice: newOrder.totalPrice,
            });

        }

        return res.status(201).json({
            status: true,
            customer: customerId,
            message: "Orders placed successfully",
            orders: createdOrders,
        });

    } catch (error) {
        console.error("Order creation error:", error);
        return res.status(500).json({ status: false, error: "Server error" });
    }
};



module.exports = {customerPlaceOrder}