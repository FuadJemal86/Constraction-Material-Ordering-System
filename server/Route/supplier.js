const express = require('express')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path');
const cookieParser = require('cookie-parser')
require('dotenv').config()



const prisma = new PrismaClient();

const router = express.Router()

router.use(cookieParser());




// sign up 


// uplode images

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image')
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
        const { companyName, email, phone, address, tinNumber, licenseNumber, password } = req.body;

        const tinRegex = /^\d{10}$/;
        if (!tinRegex.test(tinNumber)) {
            return res.status(400).json({ status: false, message: 'Invalid TIN Number. It must be 10 digits.' });
        }

        const licenseRegex = /^[A-Z]{2,3}\/\d{3,6}\/\d{4}$/;
        if (!licenseRegex.test(licenseNumber)) {
            return res.status(400).json({ status: false, message: 'Invalid License Number format' });
        }

        const isExist = await prisma.supplier.findUnique({ where: { email } });

        if (isExist) {
            return res.status(401).json({ status: false, message: 'Account Already Exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.supplier.create({
            data: { companyName, email, phone, address, tinNumber, licenseNumber, password: hashedPassword }
        });

        return res.status(200).json({ status: true, message: 'Supplier registered successfully' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
});



// login 

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const supplier = await prisma.supplier.findUnique({ where: { email } })

        if (!supplier) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong email or password!' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, supplier.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Password or Email' })
        }

        const token = jwt.sign({
            supplier: true, email: supplier.email, id: supplier.id
        }, process.env.SUPPLIER_KEY, { expiresIn: "30d" })

        res.cookie("token", token, {
            httpOnly: true,   
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });


        res.status(200).json({ loginStatus: true, message: "Login successful" });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error!' })
    }
})


// get category

router.get('/get-category', async (req, res) => {
    try {

        const category = await prisma.category.findMany()

        return res.status(200).json({ status: true, result: category })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// add product

router.post('/add-product', upload.single('image'), async (req, res) => {

    try {
        const { name, price, stock, supplierId, categoryId, } = req.body

        if (!req.file) {
            return res.status(400).json({ status: false, message: 'Image is required' });
        }

        await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                supplierId: parseInt(supplierId),
                categoryId: parseInt(categoryId),
                image: req.file.filename
            }
        })

        return res.status(200).json({ status: true, message: 'product added' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, error: 'server error' })
    }
})

// delete product

router.delete('/delete-product/:id', async (req, res) => {

    try {
        const { id } = req.params

        await prisma.product.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'product deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


// update product

router.put('/update-product/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, stock, supplierId, categoryId } = req.body;

        const existingProduct = await prisma.product.findUnique({ where: { id: Number(id) } });
        if (!existingProduct) {
            return res.status(404).json({ status: false, message: 'Product not found' });
        }

        const updateData = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            supplierId: parseInt(supplierId),
            categoryId: parseInt(categoryId),
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        await prisma.product.update({
            where: { id: Number(id) },
            data: updateData
        });

        return res.status(200).json({ status: true, message: 'Product updated successfully!' });

    } catch (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// get order

router.get('/get-order', async (req, res) => {
    try {
        const order = await prisma.order.findMany()

        return res.status(200).json({ status: true, result: order })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})




module.exports = { supplier: router }