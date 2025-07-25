const prisma = require("../../prismaCliaynt");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const supplierUp = async (req, res) => {
    try {
        const { companyName, email, phone, address, tinNumber, licenseNumber, password, lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ status: false, message: 'Location (latitude & longitude) is required.' });
        }

        const tinRegex = /^\d{10}$/;
        if (!tinRegex.test(tinNumber)) {
            return res.status(400).json({ status: false, message: 'Invalid TIN Number. It must be 10 digits.' });
        }


        const licenseExists = await prisma.supplier.findFirst({ where: { licenseNumber } });
        if (licenseExists) {
            return res.status(409).json({ status: false, message: 'Account with this license number already exists' });
        }

        const isExist = await prisma.supplier.findUnique({ where: { email } });

        if (isExist) {
            return res.status(400).json({ status: false, message: 'Account Already Exists' });
        }

        const tinExists = await prisma.supplier.findUnique({ where: { tinNumber } });
        if (tinExists) {
            return res.status(409).json({ status: false, message: 'Account with this TIN Number already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const supplier = await prisma.supplier.create({
            data: {
                companyName,
                email,
                phone,
                address,
                image: null,
                tinNumber,
                licenseNumber,
                password: hashedPassword,
                lat,
                lng
            }
        });

        // Generate JWT
        const token = jwt.sign(
            { supplier: true, email: supplier.email, id: supplier.id },
            process.env.SUPPLIER_KEY,
            { expiresIn: '30d' }
        );

        // Set cookie
        res.cookie('s-auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'lax'
        });

        return res.status(200).json({ status: true, message: 'Supplier registered successfully' });

    } catch (err) {
        console.error('Sign-up error:', err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};



module.exports = { supplierUp }
