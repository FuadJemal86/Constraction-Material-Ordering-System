const prisma = require("../../prismaCliaynt");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    try {
        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Email or Password' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        const role = admin.role;

        if (!isPasswordValid) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Email or Password' });
        }

        const isProduction = process.env.NODE_ENV === "production";

        let token;
        let cookieName;

        if (role === "SUPPERADMIN") {
            token = jwt.sign({
                supperAdmin: true,
                email: admin.email,
                id: admin.id
            }, process.env.SUPPER_ADMIN_KEY, { expiresIn: "30d" });

            cookieName = "supper-token";
        } else {
            token = jwt.sign({
                admin: true,
                email: admin.email,
                id: admin.id
            }, process.env.ADMIN_PASSWORD, { expiresIn: "30d" });

            cookieName = "a-auth-token";
        }

        res.cookie(cookieName, token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        res.status(200).json({ loginStatus: true, message: "Login successful", role });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ loginStatus: false, error: err.message });
    }
};

module.exports = { adminLogin };
