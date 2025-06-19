const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken');

const markAsAllRed = async (req, res) => {
    const token = req.cookies['s-auth-token'];

    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'No token provided. Please login first.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY);
        const supplierId = decoded.id;

        const notificationRed = await prisma.message.updateMany({
            where: { receiverId: supplierId },
            data: {
                suppliermrRed: true
            }
        });

        if (notificationRed.count === 0) {
            return res.status(400).json({ status: false, message: 'No notifications found' });
        }

        return res.status(200).json({ status: true, message: `${notificationRed.count} notifications marked as read` });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
}

module.exports = { markAsAllRed };
