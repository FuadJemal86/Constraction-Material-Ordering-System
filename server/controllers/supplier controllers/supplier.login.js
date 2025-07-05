const prisma = require("../../prismaCliaynt");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const supplierLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const supplier = await prisma.supplier.findUnique({ where: { email } })

        if (!supplier) {
            return res.status(400).json({ loginStatus: false, message: 'Wrong email or password!' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, supplier.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ loginStatus: false, message: 'Wrong Password or Email' })
        }

        const isProduction = process.env.NODE_ENV === "production";
        const token = jwt.sign({
            customer: true, email: customer.email, id: customer.id
        }, process.env.CUSTOMER_KEY, { expiresIn: "30d" })


        res.cookie("s-auth-token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return res.status(200).json({
            loginStatus: true,
            message: "Login successful",
            userId: supplier.id,
            userType: 'supplier'
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error!' })
    }
}

module.exports = { supplierLogin }