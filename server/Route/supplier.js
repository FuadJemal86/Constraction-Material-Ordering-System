// const express = require('express')
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const multer = require('multer')
// const path = require('path');
// const cookieParser = require('cookie-parser');

// require('dotenv').config()



// const prisma = new PrismaClient();

// const router = express.Router()

// router.use(cookieParser());







// // uplode images

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
//     }
// })
// const upload = multer({
//     storage: storage
// })

// // sign up 








// // get category



// // add product




// // get all product























// // update payment status

// router.put('/update-payment-status/:id', async (req, res) => {
//     const { id } = req.params
//     const { status } = req.body

//     try {
//         await prisma.payment.update({
//             where: { id: parseInt(id) },
//             data: {
//                 status: status
//             }
//         })

//         return res.status(200).json({ status: true, message: `order updated in to ${status}` })
//     } catch (err) {
//         console.log(err)
//         return res.status(500).json({ status: false, error: 'server error' })
//     }
// })




// module.exports = { supplier: router }