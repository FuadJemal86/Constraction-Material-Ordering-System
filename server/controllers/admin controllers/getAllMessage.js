const prisma = require("../../prismaCliaynt");

const getAllConversations = async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            select: {
                id: true,
                senderId: true,
                senderType: true,
                receiverId: true,
                receiverType: true,
                content: true,
                createdAt: true
            }
        });

        if (!messages || messages.length === 0) {
            return res.status(400).json({ status: false, message: 'conversation not found' });
        }

        const messagesWithNames = await Promise.all(
            messages.map(async (msg) => {
                let senderName = null;
                let receiverName = null;

                // Handle sender name
                if (msg.senderType === 'CUSTOMER') {
                    const customer = await prisma.customer.findUnique({ where: { id: msg.senderId } });
                    senderName = customer ? customer.name : null;
                } else if (msg.senderType === 'SUPPLIER') {
                    const supplier = await prisma.supplier.findUnique({ where: { id: msg.senderId } });
                    senderName = supplier ? supplier.companyName : null;
                }

                // Handle receiver name
                if (msg.receiverType === 'CUSTOMER') {
                    const customer = await prisma.customer.findUnique({ where: { id: msg.receiverId } });
                    receiverName = customer ? customer.name : null;
                } else if (msg.receiverType === 'SUPPLIER') {
                    const supplier = await prisma.supplier.findUnique({ where: { id: msg.receiverId } });
                    receiverName = supplier ? supplier.companyName : null;
                }

                return {
                    ...msg,
                    senderName,
                    receiverName
                };
            })
        );

        return res.status(200).json({ status: true, messagesWithNames });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'server error' });
    }
};

module.exports = { getAllConversations };
