const express = require('express')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config()



const prisma = new PrismaClient();

const router = express.Router()

router.use(cookieParser());







// uplode images

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

// sign up 








// get category



// add product




// get all product




// get supplier products

router.get('/get-products/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {

        const product = await prisma.product.findMany(
            {
                where: { supplierId: id }
            })

        if (product.length == 0) {
            return res.status(401).json({ status: false, message: "No product found" })
        }

        return res.status(200).json({ status: true, product })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})














// get order item

router.get('/get-order-item/:id', async (req, res) => {

    const { id } = parseInt(req.params)


    try {
        const orderItem = await prisma.orderitem.findMany({
            where: {
                id: id,
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
        });

        return res.status(200).json({ status: true, orderItem });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
})


// get payment

router.get('/get-payment', async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * 10
    const token = req.cookies['s-auth-token']


    if (!token) {
        return res.status(400).json({ status: false, message: 'token not provide' })
    }

    const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)

    const supplierId = decoded.id


    try {
        const [orders, payments] = await prisma.$transaction([
            prisma.order.findMany({
                where: { supplierId: supplierId },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            phone: true
                        }
                    }
                }
            }),
            prisma.payment.findMany({
                where: {
                }
            })
        ]);

        const transactionIds = orders.map(o => o.transactionId);

        const [actualPayments, totalPayment] = await Promise.all([
            prisma.payment.findMany({
                where: {
                    transactionId: { in: transactionIds }
                }
            }),
            prisma.payment.count()
        ]);

        if (actualPayments == 0) {
            return res.status(400).json({ status: false, message: 'payment not found' })
        }

        const transactionToCustomerMap = {};
        orders.forEach(o => {
            transactionToCustomerMap[o.transactionId] = o.customer;
        });

        const enrichedPayments = actualPayments.map(payment => ({
            ...payment,
            customer: transactionToCustomerMap[payment.transactionId] || null
        }));

        return res.status(200).json({
            status: true,
            payments: enrichedPayments,
            totalPages: Math.ceil(totalPayment / limit),
            currentPage: page,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
})

// update payment status

router.put('/update-payment-status/:id', async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        await prisma.payment.update({
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




module.exports = { supplier: router }