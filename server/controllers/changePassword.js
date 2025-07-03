const bcrypt = require("bcryptjs");
const prisma = require("../prismaCliaynt");

const changePassword = async (req, res) => {
    const { email, verificationCode, newPassword, userType } = req.body;

    if (!email || !verificationCode || !newPassword || !userType) {
        return res.status(400).json({ status: false, message: "All fields are required." });
    }

    try {
        // 1. Verify OTP
        const otpEntry = await prisma.forgotPassword.findFirst({
            where: {
                email,
                otp: verificationCode
            }
        });

        if (!otpEntry) {
            return res.status(400).json({ status: false, message: "Invalid OTP or email." });
        }

        await prisma.forgotPassword.deleteMany({
            where: { email }
        });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        let updatedUser = null;

        if (userType === "supplier") {
            updatedUser = await prisma.supplier.updateMany({
                where: { email },
                data: { password: hashedPassword }
            });
        } else if (userType === "customer") {
            updatedUser = await prisma.customer.updateMany({
                where: { email },
                data: { password: hashedPassword }
            });
        } else {
            return res.status(400).json({ status: false, message: "Invalid user type." });
        }

        if (updatedUser.count === 0) {
            return res.status(404).json({ status: false, message: "User not found." });
        }

        return res.status(200).json({ status: true, message: "Password reset successful." });
    } catch (err) {
        console.error("Password reset error:", err);
        return res.status(500).json({ status: false, message: "Server error." });
    }
};

module.exports = { changePassword };
