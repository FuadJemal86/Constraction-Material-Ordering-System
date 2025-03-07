const express = require('express')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()



const prisma = new PrismaClient();

const router = express.Router()




// sign up 

router.post('/sign-up', async (req, res) => {
    try {

        const { name, email, phone, tinNumber, password, licenseNum } = req.body

        const isExist = await prisma.supplier.findUnique({ where: { email } })

        if (isExist) {
            return res.status(401).json({ status: false, message: 'Account Already Exist' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.supplier.create({
            data: { name, email, phone, tinNumber, password: hashedPassword, licenseNum }
        })

        return res.status(200).json({ status: true, message: 'supplier registed' })


    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


// login 

router.post('/login' , async(req , res) => {
    try {
        const {email , password} = req.body

        const supplier = await prisma.supplier.findUnique({where : {email}})

        if(!supplier) {
            return res.status(401).json({loginStatus: false , message: 'Wrong email or password!'})
        }

        const isPasswordCorrect = await bcrypt.compare(password , supplier.password)

        if(!isPasswordCorrect) {
            return res.status(401).json({loginStatus: false , message: 'Wrong Password or Email'})
        }

        const token = jwt.sign({
            supplier:true , email : supplier.email , id : supplier.id
        }, process.env.SUPPLIER_KEY, {expiresIn: "30d"})


        res.status(200).json({loginStatus:true , token})
    } catch(err) {
    console.log(err)
    return res.status(500).json({status:false , error: 'server error!' })
    }
})





module.exports = { supplier: router }