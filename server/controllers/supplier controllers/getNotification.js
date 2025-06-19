const jwt = require('jsonwebtoken');
const prisma = require('../../prismaCliaynt');

const getNotifaction = async (req, res) => {
    try {

        const token = req.cookies['s-auth-token'];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please login first.'
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SUPPLIER_KEY);
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: 'Invalid token. Please login again.'
            });
        }

        const supplierId = decoded.id;

        const notifications = await prisma.message.findMany({
            where: {
                receiverId: supplierId,
                receiverType: 'SUPPLIER',
                suppliermrRed: false
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        });

        res.json({
            status: true,
            data: notifications,
            count: notifications.length
        });

    } catch (error) {
        console.error('Error fetching supplier notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message
        });
    }
}


module.exports = { getNotifaction }
