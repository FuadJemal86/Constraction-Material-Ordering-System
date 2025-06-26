const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken');

const totalProseOrderBirr = async (req, res) => {
    const token = req.cookies['s-auth-token'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided. Please login first.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY);

        const totalBirr = await prisma.order.aggregate({
            where: { supplierId: Number(decoded.id), status: 'PROCESSING' },
            _sum: { totalPrice: true }
        });



        if (totalBirr === null) {
            return res.status(400).json({ status: false, message: 'No service birr found' });
        }

        return res.status(200).json({ status: true, totalPayment: totalBirr._sum.totalPrice || 0 });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
}

module.exports = { totalProseOrderBirr }
