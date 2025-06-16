const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const customerPlaceOrder = async (req, res) => {
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

        // Generate a unique transaction ID
        const transactionId = uuidv4();

        // 1. Create the Transaction
        await prisma.transaction.create({
            data: {
                transactionId,
                customer: {
                    connect: { id: customerId }
                }
            }
        });

        const createdOrders = [];

        // 2. Create orders for each supplier group
        for (const [supplierId, groupProducts] of Object.entries(productsBySupplier)) {
            const totalPrice = groupProducts.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);

            const orderItems = groupProducts.map(p => {
                const productId = parseInt(p.productId, 10);
                const quantity = parseInt(p.quantity, 10);
                const unitPrice = parseFloat(p.unitPrice);

                if (!productId || !quantity || isNaN(unitPrice)) {
                    throw new Error("Invalid product data in cart");
                }

                return {
                    product: {
                        connect: { id: productId }
                    },
                    quantity,
                    unitPrice,
                    subtotal: quantity * unitPrice,
                };
            });

            // Get supplier info for email
            const supplier = await prisma.supplier.findUnique({
                where: { id: parseInt(supplierId, 10) },
            });

            if (!supplier) {
                console.error(`Supplier not found: ${supplierId}`);
                continue; // Skip this supplier or handle error as needed
            }

            const newOrder = await prisma.order.create({
                data: {
                    customer: { connect: { id: customerId } },
                    supplier: { connect: { id: parseInt(supplierId, 10) } },
                    address,
                    latitude,
                    longitude,
                    deliveryOption,
                    totalPrice,
                    transaction: {
                        connect: { transactionId: transactionId }
                    },
                    orderitem: {
                        create: orderItems
                    }
                },
                include: {
                    orderitem: true,
                    customer: true
                }
            });

            createdOrders.push({
                customerId: newOrder.customerId,
                supplierId: newOrder.supplierId,
                totalPrice: newOrder.totalPrice,
                transactionId: newOrder.transactionId,
            });

            // Prepare and send email to supplier
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: supplier.email,
                    subject: 'New Order Received - Jejan Platform',
                    html: `
                        <h2>New Order Notification</h2>
                        <p>Hello ${supplier.companyName},</p>
                        <p>You have received a new order on Jejan platform with the following details:</p>
                        
                        <h3>Order Summary</h3>
                        <ul>
                            <li><strong>Order ID:</strong> ${newOrder.id}</li>
                            <li><strong>Transaction ID:</strong> ${transactionId}</li>
                            <li><strong>Customer:</strong> ${newOrder.customer.name}</li>
                            <li><strong>Delivery Address:</strong> ${address}</li>
                            <li><strong>Delivery Option:</strong> ${deliveryOption}</li>
                            <li><strong>Total Amount:</strong> ${totalPrice.toFixed(2)}</li>
                        </ul>
                        
                        <h3>Order Items</h3>
                        <table border="1" cellpadding="5" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${newOrder.orderitem.map(item => `
                                    <tr>
                                        <td>${item.quantity}</td>
                                        <td>${item.unitPrice.toFixed(2)}</td>
                                        <td>${item.subtotal.toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        
                        <p>Please log in to your Jejan supplier dashboard to process this order.</p>
                        <p>Thank you for using our platform!</p>
                        <p><strong>Jejan Team</strong></p>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`Email sent to supplier ${supplier.email}`);
            } catch (emailError) {
                console.error('Failed to send email to supplier:', emailError);
            }
        }

        return res.status(201).json({
            status: true,
            customer: customerId,
            message: "Orders placed successfully",
            transactionId,
            orders: createdOrders
        });

    } catch (error) {
        console.error("Order creation error:", error);
        return res.status(500).json({ status: false, error: "Server error" });
    }
};

module.exports = { customerPlaceOrder };