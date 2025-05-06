const prisma = require("../../prismaCliaynt");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const Login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    try {
        const supperAdmin = await prisma.supperAdmin.findUnique({ where: { email } });

        if (!supperAdmin) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Email or Password' });
        }

        const isPasswordValid = await bcrypt.compare(password, supperAdmin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Email or Password' });
        }

        const token = jwt.sign(
            { supperAdmin: true, email: supperAdmin.email, id: supperAdmin.id },
            process.env.SUPPER_ADMIN_KEY,
            { expiresIn: '30d' }
        );

        res.cookie("supper-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "lax",
        });

        res.status(200).json({ loginStatus: true, message: "Login successful" });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ loginStatus: false, error: err.message });
    }
};

module.exports = { Login };
