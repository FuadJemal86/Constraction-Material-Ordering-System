const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')

const customerLogin = async (req, res) => {
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

        // Include userId and userType in the response
        return res.status(200).json({
            loginStatus: true,
            message: "Login successful",
            userId: customer.id,
            userType: 'customer'
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error!' })
    }
}

module.exports = { customerLogin }