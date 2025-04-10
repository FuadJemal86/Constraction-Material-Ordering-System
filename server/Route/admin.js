const express = require('express')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const prisma = new PrismaClient();



const router = express.Router()




router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    try {
        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Email or Password' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Email or Password' });
        }

        const token = jwt.sign(
            { admin: true, email: admin.email, id: admin.id },
            process.env.ADMIN_PASSWORD,
            { expiresIn: '30d' }
        );

        res.cookie("a-auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "lax",
        });

        res.status(200).json({ loginStatus: true, message: "Login successful" });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ loginStatus: false, error: err.message });
    }
});

// add-account

router.post('/add-account', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    try {

        const existhingUsr = await prisma.admin.findUnique({ where: { email } })

        if (existhingUsr) {
            return res.status(400).json({ status: false, message: 'Account Already Exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const account = await prisma.admin.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ status: true, message: 'Account added successfully' });

    } catch (err) {
        console.error("server error:", err.message);
        res.status(500).json({ status: false, error: err.message });
    }
});


// get supplier 

router.get('/get-supplier', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const [suppliers, totalSuppliers] = await Promise.all([
            prisma.supplier.findMany({

                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    phone: true,
                    companyName: true,
                    email: true,
                    createdAt: true,
                    address: true,
                    tinNumber: true,
                    licenseNumber: true,
                    isApproved: true
                }
            }),
            prisma.supplier.count() // total count for pagination
        ]);

        if (suppliers.length === 0) {
            return res.status(404).json({ status: false, message: 'No suppliers found' });
        }

        return res.status(200).json({
            status: true,
            result: suppliers,
            totalPages: Math.ceil(totalSuppliers / limit),
            currentPage: page
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
});



// delete supplier

router.delete('/delete-supplier/:id', async (req, res) => {

    try {
        const { id } = req.params

        const existingSupplier = await prisma.supplier.findUnique({
            where: { id: Number(id) }
        });

        if (!existingSupplier) {
            return res.status(404).json({ status: false, message: 'Supplier not found' });
        }

        await prisma.supplier.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'supplier deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// update supplier

router.put('/update-supplier/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, email, phone, address, tinNumber, licenseNumber, password } = req.body;


        const updatedSupplier = await prisma.supplier.update({
            where: { id: Number(id) },
            data: { companyName, email, phone, address, tinNumber, licenseNumber, password }
        });

        return res.status(200).json({ status: true, message: 'Supplier updated successfully!' });

    } catch (err) {
        console.error('Error updating supplier:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// update customer status

router.put("/update-supplier-status/:supplierId", async (req, res) => {
    const { supplierId } = req.params;
    const { isApproved } = req.body;

    try {
        const updatedSupplier = await prisma.supplier.update({
            where: { id: parseInt(supplierId) }, // Ensure ID is an integer
            data: { isApproved }, // Update the status
        });

        res.json({ status: true, message: "Supplier status updated successfully", result: updatedSupplier });
    } catch (error) {
        console.error("Error updating supplier status:", error);
        res.status(500).json({ status: false, message: "Failed to update supplier status" });
    }
});




// get customer

router.get('/get-customer', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 1
    const skip = (page - 1) * limit
    try {
        const [supplier, totalCustomer] = await Promise.all([
            prisma.customer.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.customer.count()
        ])
        console.log(supplier)
        if (supplier == 0) {
            return res.status(404).json({ status: false, message: 'customer not found' })
        }
        return res.status(200).json({
            status: true,
            result: supplier,
            totalPages: Math.ceil(totalCustomer / limit),
            currentPage: page

        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// delete customer

router.delete('/delete-customer/:id', async (req, res) => {

    try {
        const { id } = req.params

        await prisma.customer.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'customer deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// update customer

router.put('/update-customer/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone } = req.body;


        await prisma.customer.update({
            where: { id: Number(id) },
            data: { name, email, password, phone }
        });

        return res.status(200).json({ status: true, message: 'customer updated successfully!' });

    } catch (err) {
        console.error('Error updating supplier:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// get order

router.get('/get-order', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {

        const [order, totalSuppliers] = await Promise.all([

            prisma.order.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    supplier: true,
                    customer: {
                        select: {
                            name: true,
                            phone: true
                        }
                    }
                }
            }),
            prisma.order.count()
        ])

        if (order == 0) {
            return res.status(400).json({ status: false, message: 'order not found' })
        }

        return res.status(200).json({
            status: true,
            result: order,
            totalPages: Math.ceil(totalSuppliers / limit),
            currentPage: page
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// get order item

router.get('/get-order-item/:id', async (req, res) => {

    const  id  = parseInt(req.params.id)

    try {
        if (!id) {
            throw new Error("OrderItem ID is required");
        }

        const orderItem = await prisma.orderitem.findMany({
            where: { orderId : id },
            include: {
                order: {
                    include: {
                        customer: true,
                    },
                },
                product: {
                    select: {
                        name: true,
                        category: true,
                    },
                },
            },
        });

        return res.status(200).json({ status: true, orderItem });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
})

// get order item

router.get('/get-order-item', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    try {
        const orders = await prisma.order.findMany({
            include: {
                supplier: {
                    select: {
                        companyName: true,
                        phone: true,
                    }
                }
            }
        });

        const orderIds = orders.map(order => order.id);

        if (orderIds.length === 0) {
            return res.status(200).json({ status: true, orderItem: [] });
        }

        const [orderItem, totalOrder] = await Promise.all([

            prisma.orderitem.findMany({
                skip,
                take: limit,
                orderBy: {
                    id: 'desc' // optional: newest first
                },
                where: {
                    orderId: { in: orderIds },
                },
                include: {

                    order: {
                        include: {
                            customer: true,
                        },
                    },
                    product: {
                        select: {
                            name: true,
                            category: true,
                        },
                    },
                },
            }),

            prisma.orderitem.count()
        ]);

        return res.status(200).json({
            status: true,
            orderItem,
            totalPages: Math.ceil(totalOrder / limit),
            currentPage: page
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
})

// update the status of order 

router.put('/update-order-status/:id', async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        await prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                status: status
            }
        })

        return res.status(200).json({ status: true, message: `order updated in to ${status}` })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// add category

router.post('/add-category', async (req, res) => {
    try {
        const { category } = req.body

        const ifExist = await prisma.category.findUnique({ where: { category } })

        if (ifExist) {
            return res.status(401).json({ status: false, message: 'category already exist' })
        }

        await prisma.category.create({
            data: { category }
        })
        return res.status(200).json({ status: true, message: 'category added' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, error: 'server error' })
    }
})

// get categorys

router.get('/get-category', async (req, res) => {
    try {

        const category = await prisma.category.findMany()

        return res.status(200).json({ status: true, result: category })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


// delete category

router.delete('/delete-category/:id', async (req, res) => {

    try {
        const { id } = req.params

        await prisma.customer.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'category deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


// add address

router.post('/add-address', async (req, res) => {
    try {
        const { address } = req.body

        const ifExist = await prisma.address.findFirst({ where: { address } })

        if (ifExist) {
            return res.status(401).json({ status: false, message: 'zone already exist' })
        }

        await prisma.address.create({
            data: { address }
        })
        return res.status(200).json({ status: true, message: 'zone added' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, error: 'server error' })
    }
})


router.get('/get-address', async (req, res) => {
    try {
        const address = await prisma.address.findMany();

        if (address.length === 0) { // Corrected condition
            return res.status(404).json({ status: false, message: 'No zone found' });
        }

        return res.status(200).json({ status: true, result: address });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
})

// get payment

router.get('/get-payment', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const [orders, count] = await prisma.$transaction([
            prisma.order.findMany({
                include: {
                    supplier: {
                        select: {
                            id: true,
                            companyName: true,
                            phone: true
                        }
                    },
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            phone: true
                        }
                    }
                }
            }),
            prisma.payment.count() // total count for pagination
        ]);

        const transactionIds = orders.map(o => o.transactionId);

        const actualPayments = await prisma.payment.findMany({
            where: {
                transactionId: { in: transactionIds }
            },
            include: {
                bank: true,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (actualPayments.length === 0) {
            return res.status(400).json({ status: false, message: 'No payments found' });
        }

        const transactionToCustomerMap = {};
        const transactionToSupplierMap = {};
        orders.forEach(o => {
            transactionToCustomerMap[o.transactionId] = o.customer;
            transactionToSupplierMap[o.transactionId] = o.supplier;
        });

        const enrichedPayments = actualPayments.map(payment => ({
            ...payment,
            customer: transactionToCustomerMap[payment.transactionId] || null,
            supplier: transactionToSupplierMap[payment.transactionId] || null
        }));

        return res.status(200).json({
            status: true,
            payments: enrichedPayments,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalPayments: count
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
});


// delete address

router.delete('/delete-address/:id', async (req, res) => {

    try {
        const { id } = req.params

        await prisma.address.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'address deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})





module.exports = { admin: router }