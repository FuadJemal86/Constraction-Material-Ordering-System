const path = require('path');
const multer = require('multer');
const prisma = require("../../prismaCliaynt");
const nodemailer = require('nodemailer');

// Setup multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Setup email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const customerPayment = [
    upload.single('image'),
    async (req, res) => {
        const transactionId = req.params.transactionId;
        const { bankTransactionId, bankId, service } = req.body;

        if (!transactionId) {
            return res.status(400).json({ status: false, message: 'Order Not Found' });
        }

        try {
            const order = await prisma.order.findFirst({
                where: { transactionId },
                select: {
                    totalPrice: true,
                    customer: {
                        select: { name: true, email: true }
                    }
                }
            });

            if (!order) {
                return res.status(404).json({ status: false, message: "Order not found" });
            }

            const amount = parseFloat(order.totalPrice);

            const existingPayment = await prisma.payment.findFirst({
                where: { transactionId }
            });

            if (existingPayment) {
                return res.status(400).json({ status: false, message: "Payment already made for this order" });
            }

            const newPayment = await prisma.payment.create({
                data: {
                    amount,
                    bankId: parseInt(bankId),
                    status: "PENDING",
                    transactionId,
                    service: parseFloat(service),
                    image: req.file ? req.file.filename : null,
                    bankTransactionId
                }
            });

            const admins = await prisma.admin.findMany({
                select: { email: true }
            });

            for (const admin of admins) {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: admin.email,
                    subject: 'New Customer Payment Received',
                    html: `
                        <h2>New Payment Submitted</h2>
                        <p><strong>Customer:</strong> ${order.customer.name}</p>
                        <p><strong>Transaction ID:</strong> ${transactionId}</p>
                        <p><strong>Bank Transaction ID:</strong> ${bankTransactionId}</p>
                        <p><strong>Amount:</strong> ${amount.toFixed(2)}</p>
                        <p><strong>Status:</strong> PENDING</p>
                        <p>Please log into the admin panel to review and confirm this payment.</p>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`Email sent to admin ${admin.email}`);
            }

            return res.status(201).json({
                status: true,
                message: "Payment submitted and pending confirmation",
                payment: newPayment
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: false, error: "Server error" });
        }
    }
];

module.exports = { customerPayment }
