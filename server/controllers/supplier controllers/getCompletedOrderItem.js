const jwt = require("jsonwebtoken");
const prisma = require("../../prismaCliaynt");

const completedPaymentOrderItem = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        console.log(id)
        return res.status(400).json({ status: false, message: 'ID not provided' });
    }

    let supplierId;

    try {
        const token = req.cookies['s-auth-token'];

        if (!token) {
            return res.status(401).json({ status: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY);
        supplierId = decoded.id;

    } catch (err) {
        console.log(err);
        return res.status(401).json({ status: false, message: 'Unauthorized: Token verification failed' });
    }

    try {
        // Fetch the order with supplierId and transactionId
        const order = await prisma.order.findFirst({
            where: {
                supplierId: supplierId,
                transactionId: id
            },
            select: {
                id: true
            }
        });

        if (!order) {
            return res.status(404).json({ status: false, message: 'Order not found' });
        }

        // Fetch the order items for the found order
        const orderItems = await prisma.orderitem.findMany({
            where: {
                orderId: order.id
            },
            include: {
                order: {
                    include: {
                        customer: {
                            select: { name: true }
                        }
                    }
                },
                product: {
                    select: {
                        name: true,
                        category: true
                    }
                }
            }
        });


        return res.status(200).json({ status: true, orderItems });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { completedPaymentOrderItem };
