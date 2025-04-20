
const path = require('path')
const multer = require('multer')
// make payment

const prisma = require("../../prismaCliaynt");


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



const customerPayment = [upload.single('image'), async (req, res) => {
    const transactionId = req.params.transactionId;
    const { bankTransactionId, bankId } = req.body;

    if (!transactionId) {
        return res.status(400).json({ status: false, message: 'Order Not Found' });
    }

    try {
        const order = await prisma.order.findFirst({
            where: { transactionId },
            select: {
                totalPrice: true,
                customer: true
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
                image: req.file ? req.file.filename : null,
                bankTransactionId
            }
        });

        return res.status(201).json({
            status: true,
            message: "Payment submitted and pending confirmation",
            payment: newPayment
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: "Server error" });
    }
}];



module.exports = { customerPayment }