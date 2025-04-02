const express = require('express')
const { PrismaClient, message_receiverType } = require('@prisma/client');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid')



const prisma = new PrismaClient()
const router = express.Router()
router.use(cookieParser());


// sign up


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

router.post('/sign-up', async (req, res) => {
    try {

        const { name, email, password, phone } = req.body

        const isExist = await prisma.customer.findUnique({ where: { email } })

        if (isExist) {
            return res.status(401).json({ status: false, message: 'Account Already Exist' })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        await prisma.customer.create({
            data: { name, email, password: hashPassword, phone }
        })

        return res.status(200).json({ status: true, message: 'customer registed' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


// login

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const customer = await prisma.customer.findUnique({ where: { email } })

        if (!customer) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong email or password!' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, customer.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Password or Email' })
        }

        const token = jwt.sign({
            customer: true, email: customer.email, id: customer.id
        }, process.env.CUSTOMER_KEY, { expiresIn: "30d" })

        res.cookie("x-auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "lax",
        });


        return res.status(200).json({ loginStatus: true, message: "Login successful" });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error!' })
    }
})

// validate the token

const verifyToken = (req, res, next) => {
    // console.log("Cookies:", req.cookies["x-auth-token"]);
    const token = req.cookies["x-auth-token"];

    if (!token) {
        return res.status(401).json({ valid: false, message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.CUSTOMER_KEY);
        req.customer = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ valid: false, message: "Invalid or expired token!" });
    }
};

router.get("/verify-token", verifyToken, async (req, res) => {
    try {
        const user = await prisma.customer.findUnique({
            where: { id: req.customer.id }
        });

        if (!user) {
            return res.status(401).json({ valid: false, message: "User not found" });
        }

        res.status(200).json({ valid: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ valid: false, message: "Server error" });
    }
});

//get  category

router.get('/get-category', async (req, res) => {
    try {
        const category = await prisma.category.findMany()

        if (!category) {
            return res.status(401).json({ status: false, message: "category not found" })
        }

        return res.status(200).json({ status: true, category })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, message: 'server error' })
    }
})

// get supplier

router.get('/get-supplier', async (req, res) => {
    try {
        const supplier = await prisma.supplier.findMany({
            select: {
                id: true,
                companyName: true,
                isApproved: true,
                address: true
            }
        });

        if (!supplier || supplier.length === 0) {
            return res.status(404).json({ status: false, message: "supplier not found" });
        }

        return res.status(200).json({ status: true, supplier });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Server error' });
    }
});


// place order

router.post('/place-order', async (req, res) => {
    const token = req.cookies["x-auth-token"];

    if (!token) {
        return res.status(401).json({ valid: false, message: "Unauthorized: No token provided" });
    }

    let customerId
    try {
        const decoded = jwt.verify(token, process.env.CUSTOMER_KEY);
        customerId = parseInt(decoded.id, 10)
    } catch (err) {
        return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    try {
        const { supplierId, address, latitude, longitude, deliveryOption, products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ status: false, message: "Invalid cart data" });
        }

        let totalPrice = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
        const transactionId = uuidv4();

        const newOrder = await prisma.order.create({
            data: {
                customerId,
                supplierId,
                address,
                latitude,
                longitude,
                deliveryOption,
                totalPrice,
                transactionId,
                orderitem: {
                    create: products.map(p => ({
                        productId: parseInt(p.productId, 10),
                        quantity: parseInt(p.quantity, 10),
                        unitPrice: parseFloat(p.unitPrice, 10),
                        subtotal: parseFloat(p.quantity * p.unitPrice, 10)
                    }))

                }
            },
            include: { orderitem: true }
        });

        console.log(newOrder)

        return res.status(201).json({ status: true, message: "Order placed successfully", orderId: newOrder.id });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Server error" });
    }
});


// get customer transitionId from cookies

router.get('/get-transitionId', async (req, res) => {
    const token = req.cookies['x-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: "Unauthorized: No token provided" })
    }

    const decoded = jwt.verify(token, process.env.CUSTOMER_KEY)

    const customerId = parseInt(decoded.id, 10)


    try {
        const transactionId = await prisma.order.findMany({
            where: {
                customerId: customerId,
                status: 'PENDING'
            },
            select: {
                status: true,
                transactionId: true
            }
        })

        const pendingCount = await prisma.order.count({
            where: {
                customerId: customerId,
                status: 'PENDING'
            }
        });

        return res.status(200).json({ status: true, result: transactionId, count: pendingCount })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Server error" });
    }
})

// make payment

router.post('/make-payment/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { bankTransactionId, bankId } = req.body;

    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            select: {
                transactionId: true,
                totalPrice: true
            }
        });

        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found" });
        }

        const { transactionId, totalPrice: amount } = order;

        const existingPayment = await prisma.payment.findFirst({
            where: { transactionId }
        });

        if (existingPayment) {
            return res.status(400).json({ status: false, message: "Payment already made for this order" });
        }

        const newPayment = await prisma.payment.create({
            data: {
                amount,
                bankId: parseInt(bankId),
                status: "PENDING",
                transactionId,
                image: req.file ? req.file.filename : null,
                bankTransactionId
            }
        });

        return res.status(201).json({ status: true, message: "Payment successful", payment: newPayment });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: "Server error" });
    }
});

// get pending payment

router.get('/get-pending-payment/:id', async (req, res) => {

    const { id } = req.params;

    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            select: {
                transactionId: true
            }
        })

        if (!order) {
            return res.status(400).json({ status: false, message: 'order not found' })
        }

        const { transactionId } = order

        const pendingSatus = await prisma.payment.findUnique({
            where: { transactionId: transactionId, status: 'PENDING' },
            select: {
                status: true
            }
        })

        return res.status(200).json({ status: true, paymentStatus: pendingSatus })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: "Server error" });
    }

})

// get payment status

router.get('/get-payment-status', async (req, res) => {
    const token = req.cookies['x-auth-token'];

    if (!token) {
        return res.status(401).json({ valid: false, message: "Unauthorized: No token provided" });
    }

    let customerId;
    try {
        const decoded = jwt.verify(token, process.env.CUSTOMER_KEY);
        customerId = parseInt(decoded.id, 10);
    } catch (err) {
        return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    try {

        const [orders, payments] = await prisma.$transaction([
            prisma.order.findMany({
                where: { customerId },
                select: { transactionId: true, status: true , totalPrice:true }
            }),
            prisma.payment.findMany({
                where: { 
                    transactionId: {
                        in: (await prisma.order.findMany({
                            where: { customerId },
                            select: { transactionId: true , status: true  , totalPrice:true }
                        })).map(order => order.transactionId)
                    }
                },
                select: {
                    transactionId: true,
                    status: true
                }
            })
        ]);

        if (orders.length === 0) {
            return res.status(400).json({ status: false, message: 'No orders found' });
        }

        return res.status(200).json({
            status: true,
            orders: orders.map(order => order.status),
            paymentStatuses: payments
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
});

// get nearby supplier

router.get('/nearby-suppliers', async (req, res) => {
    try {
        const { latitude, longitude, radius = 300 } = req.query;

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const searchRadius = parseFloat(radius);

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid latitude or longitude',
            });
        }

        const suppliers = await prisma.supplier.findMany({
            select: {
                id: true,
                companyName: true,
                lat: true,
                lng: true,
                address: true,
                phone: true,
            },
        });

        const toRadians = (deg) => (deg * Math.PI) / 180;
        const earthRadius = 6371; // Radius of Earth in km

        const nearbySuppliers = suppliers
            .map((supplier) => {
                if (!supplier.lat || !supplier.lng) return null;

                const dLat = toRadians(supplier.lat - lat);
                const dLng = toRadians(supplier.lng - lng);
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRadians(lat)) *
                    Math.cos(toRadians(supplier.lat)) *
                    Math.sin(dLng / 2) *
                    Math.sin(dLng / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = earthRadius * c;

                return { ...supplier, distance };
            })
            .filter((supplier) => supplier && supplier.distance < searchRadius)
            .sort((a, b) => a.distance - b.distance);

        return res.json({
            status: true,
            suppliers: nearbySuppliers,
            message: `Found ${nearbySuppliers.length} suppliers within ${searchRadius}km`,
        });
    } catch (error) {
        console.error('Error finding nearby suppliers:', error);
        return res.status(500).json({
            status: false,
            message: 'An error occurred while finding nearby suppliers',
        });
    }
});





module.exports = { customer: router }