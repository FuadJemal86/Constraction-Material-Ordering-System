const { default: api } = require("../../../cliaynt/src/api");
const prisma = require("../../prismaCliaynt");
const nodemailer = require("nodemailer");

const checkEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ status: false, message: 'Email required' });
    }

    try {
        const checkEmailExist = await prisma.customer.findFirst({
            where: { email: email }
        });

        if (!checkEmailExist) {
            return res.status(400).json({ status: false, message: 'Email not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.forgotPassword.create({
            data: {
                email,
                otp
            }
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'jejan E-commerce Your OTP Code',
            text: `Your OTP code is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ status: true, message: 'OTP sent to email' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { checkEmail };
