const express = require('express')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()



const prisma = new PrismaClient()
const router = express.Router()
router.use(cookieParser());


// sign up

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


        res.status(200).json({ loginStatus: true, message: "Login successful" });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error!' })
    }
})

// validate the token

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; 

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



// place order

router.post('/place-order', async (req, res) => {
    try {
        const { customerId, supplierId, addressId, totalPrice } = req.body;

        const newOrder = await prisma.order.create({
            data: { customerId, supplierId, addressId, totalPrice }
        });

        if (orderItems && orderItems.length > 0) {
            const itemsData = orderItems.map(item => ({
                orderId: newOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            }));

            await prisma.orderitem.createMany({
                data: itemsData
            });
        }

        return res.status(200).json({ status: true, message: "Order placed successfully", order: newOrder });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: "Server error" });
    }
});


// make payment

router.post('/make-payment', async (req, res) => {
    try {
        const { orderId, amount, bankId } = req.body;

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found" });
        }

        const existingPayment = await prisma.payment.findUnique({ where: { orderId } });
        if (existingPayment) {
            return res.status(400).json({ status: false, message: "Payment already made for this order" });
        }

        const newPayment = await prisma.payment.create({
            data: { orderId, amount, bankId, status: "COMPLETED" }
        });

        return res.status(201).json({ status: true, message: "Payment successful", payment: newPayment });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: "Server error" });
    }
});





module.exports = { customer: router }