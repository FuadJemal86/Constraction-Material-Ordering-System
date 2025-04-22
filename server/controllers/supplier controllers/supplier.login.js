const prisma = require("../../prismaCliaynt");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const supplierLogin =  async (req, res) => {
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

        res.cookie("s-auth-token", token, {
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
}

module.exports = {supplierLogin}