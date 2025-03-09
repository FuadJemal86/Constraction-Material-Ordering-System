const express = require('express')
const { PrismaClient } = require('@prisma/client');



const prisma =new  PrismaClient()
const router = express.Router()


// sign up

router.post('/sign-up', async (req, res) => {
    try {

        const { name, email, password, phone } = req.body

        const isExist = await prisma.customer.findUnique({ where: { email } })

        if (isExist) {
            return res.status(401).json({ status: false, message: 'Account Already Exist' })
        }

        await prisma.supplier.create({
            data: { name, email, password, phone }
        })

        return res.status(200).json({ status: true, message: 'supplier registed' })


    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


// place order

router.post('/place-order', async (req, res) => { 
    try {
        const { customerId, supplierId, totalPrice, addressId, orderItems } = req.body;

        const newOrder = await prisma.order.create({
            data: { customerId, supplierId, totalPrice, addressId }
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





module.exports = {customer: router}