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




// sign up 


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

router.post('/sign-up', async (req, res) => {
    try {
        const { companyName, email, phone, address, tinNumber, licenseNumber, password, lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ status: false, message: 'Location (latitude & longitude) is required.' });
        }

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
            data: {
                companyName,
                email,
                phone,
                address,
                tinNumber,
                licenseNumber,
                password: hashedPassword,
                lat,   // Store latitude
                lng    // Store longitude
            }
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

        res.cookie("t-auth-token", token, {
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

        const token = req.cookies["t-auth-token"];
        if (!token) {
            return res.status(401).json({ status: false, message: 'Unauthorized, no token found' });
        }

        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY);
        const supplierId = decoded.id;

        const { name, price, stock, categoryId, unit, deliveryPricePerKm } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: false, message: 'Image is required' });
        }


        await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                supplierId,
                categoryId: parseInt(categoryId),
                unit,
                deliveryPricePerKm: parseFloat(deliveryPricePerKm),
                image: req.file ? req.file.filename : null,
            },
        })

        return res.status(200).json({ status: 200, message: 'product add' })


    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});

// get all product

router.get('/get-product', async (req, res) => {

    const token = req.cookies['t-auth-token'];

    if (!token) {
        return res.status(401).json({ valid: false, message: "Unauthorized: No token provided" });
    }
    try {

        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)
        const supplierId = decoded.id


        const product = await prisma.product.findMany({
            where: { supplierId: supplierId },
            include: { category: true }
        });

        return res.status(200).json({ status: true, result: product })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


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

// get-account

router.get('/get-account', async (req, res) => {

    const token = req.cookies['x-auth-token'];

    if (!token) {
        return res.status(401).json({ valid: false, message: "Unauthorized: No token provided" });
    }
    try {

        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)
        const supplierId = decoded.id


        const account = await prisma.bank.findMany({
            where: { supplierId: supplierId },
        });

        return res.status(200).json({ status: true, result: account })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// add account

router.post('/add-account', async (req, res) => {

    const token = req.cookies['t-auth-token']

    if (!token) {
        return res.status(401).json({ valid: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)

    const supplierId = decoded.id

    const { bankName, account } = req.body

    if (!bankName || !account) {
        return res.status(400).json({ status: false, message: 'pleas fill the feild' })
    }

    try {
        await prisma.bank.create({
            data: {
                supplierId,
                bankName,
                account
            }
        })

        return res.status(200).json({ status: true, message: 'account added' })
    } catch (err) {
        console.log(err)
        return res.status(500).json('server error')
    }

})

// delete account

router.delete('/delete-account/:id', async (req, res) => {

    const { id } = req.params


    try {
        const bankRecord = await prisma.bank.findMany({
            where: { id: Number(id) }
        });

        if (!bankRecord) {
            return res.status(404).json({ message: "Bank record not found." });
        }

        await prisma.bank.delete({ where: { id: Number(id) } });
        res.status(200).json({ status: true, message: "Bank record deleted successfully." });


    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


// get order

router.get('/get-order', async (req, res) => {

    const token = req.cookies['t-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provide' })
    }

    const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)

    const supplierId = parseInt(decoded.id)

    try {
        const order = await prisma.order.findMany({
            where: { supplierId: supplierId },

            include: {
                customer: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if (order == 0) {
            return res.status(400).json({ status: false, message: 'order not found' })
        }

        return res.status(200).json({ status: true, order })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
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


// get payment

router.get('/get-payment', async (req, res) => {
    const token = req.cookies['t-auth-token']

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

        const actualPayments = await prisma.payment.findMany({
            where: {
                transactionId: { in: transactionIds }
            }
        });

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

        return res.status(200).json({ status: true, payments: enrichedPayments });


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