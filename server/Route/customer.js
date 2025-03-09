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



module.exports = {customer: router}