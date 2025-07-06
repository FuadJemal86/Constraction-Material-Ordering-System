const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');

const supperAdmin = require('./Route/supperAdminRout');
const adminRout = require('./Route/adminRout');
const customerRout = require('./Route/customerRout');
const supplierRout = require('./Route/supplierRout');
const prisma = require('./prismaCliaynt');
const { changePassword } = require('./controllers/changePassword');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
// Socket.IO setup
const io = socketIo(server, {
    cors: {
        origin: ['https://jejan.vercel.app', 'https://jejan-admin-portal.vercel.app', 'http://localhost:5174', 'http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://jejan.vercel.app', 'https://jejan-admin-portal.vercel.app', 'http://localhost:5174', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE'],
    credentials: true
}));

app.use(express.static('public'));
app.use('/supper-admin', supperAdmin);
app.use('/supplier', supplierRout);
app.use('/customer', customerRout);
app.use('/admin', adminRout);
app.use('/change-password', changePassword)
app.get("/", (req, res) => {
    res.send("Welcome to the jejan System API!");
});
// Store connected users

prisma
    .$connect()
    .then(() => {
        console.log("Connected to database via Prisma!");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

const connectedUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their ID and type
    socket.on('join', async (userData) => {
        try {
            const { userId, userType } = userData;

            // Verify user exists in database
            let user = null;
            if (userType === 'customer') {
                user = await prisma.customer.findUnique({
                    where: { id: parseInt(userId) },
                    select: { id: true, name: true, email: true, isActive: true }
                });
            } else if (userType === 'supplier') {
                user = await prisma.supplier.findUnique({
                    where: { id: parseInt(userId) },
                    select: { id: true, companyName: true, email: true, isActive: true }
                });
            }

            if (!user || !user.isActive) {
                socket.emit('error', { message: 'User not found or inactive' });
                return;
            }

            // Store user info
            connectedUsers.set(socket.id, {
                userId: parseInt(userId),
                userType: userType.toLowerCase(),
                socketId: socket.id,
                userData: user
            });

            // Join room
            const roomName = `${userType}_${userId}`;
            socket.join(roomName);

            console.log(`${userType} ${userId} (${user.name || user.companyName}) joined`);

            socket.emit('connected', {
                message: 'Successfully connected to chat',
                user: {
                    id: user.id,
                    name: user.name || user.companyName,
                    email: user.email,
                    type: userType
                }
            });

        } catch (error) {
            console.error('Join error:', error);
            socket.emit('error', { message: 'Failed to join chat' });
        }
    });

    // Handle sending messages
    socket.on('sendMessage', async (messageData) => {
        try {
            const sender = connectedUsers.get(socket.id);

            if (!sender) {
                socket.emit('error', { message: 'User not authenticated' });
                return;
            }

            const { receiverId, receiverType, content } = messageData;

            // Verify receiver exists
            let receiver = null;
            if (receiverType === 'customer') {
                receiver = await prisma.customer.findUnique({
                    where: { id: parseInt(receiverId) },
                    select: { id: true, name: true, isActive: true }
                });
            } else if (receiverType === 'supplier') {
                receiver = await prisma.supplier.findUnique({
                    where: { id: parseInt(receiverId) },
                    select: { id: true, companyName: true, isActive: true }
                });
            }

            if (!receiver || !receiver.isActive) {
                socket.emit('error', { message: 'Receiver not found or inactive' });
                return;
            }

            // Save message to database
            const savedMessage = await prisma.message.create({
                data: {
                    senderId: sender.userId,
                    senderType: sender.userType.toUpperCase(),
                    receiverId: parseInt(receiverId),
                    receiverType: receiverType.toUpperCase(),
                    content: content.trim()
                }
            });

            // Prepare message object
            const messageToSend = {
                id: savedMessage.id,
                senderId: sender.userId,
                senderName: sender.userData.name || sender.userData.companyName,
                senderType: sender.userType,
                receiverId: parseInt(receiverId),
                receiverName: receiver.name || receiver.companyName,
                receiverType: receiverType.toLowerCase(),
                content: savedMessage.content,
                createdAt: savedMessage.createdAt
            };

            // Send confirmation to sender
            socket.emit('messageReceived', messageToSend);

            // Send to receiver if online
            const receiverRoomName = `${receiverType}_${receiverId}`;
            socket.to(receiverRoomName).emit('newMessage', messageToSend);

            console.log(`Message: ${sender.userType} ${sender.userId} -> ${receiverType} ${receiverId}`);

        } catch (error) {
            console.error('Send message error:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Get conversation history
    socket.on('getConversation', async (requestData) => {
        try {
            const sender = connectedUsers.get(socket.id);

            if (!sender) {
                socket.emit('error', { message: 'User not authenticated' });
                return;
            }

            const { otherUserId, otherUserType } = requestData;

            // Get messages between users
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        {
                            senderId: sender.userId,
                            senderType: sender.userType.toUpperCase(),
                            receiverId: parseInt(otherUserId),
                            receiverType: otherUserType.toUpperCase()
                        },
                        {
                            senderId: parseInt(otherUserId),
                            senderType: otherUserType.toUpperCase(),
                            receiverId: sender.userId,
                            receiverType: sender.userType.toUpperCase()
                        }
                    ]
                },
                orderBy: { createdAt: 'asc' },
                take: 100 // Limit to last 100 messages
            });

            // Get user names for messages
            const customerIds = [...new Set(messages.filter(m => m.senderType === 'CUSTOMER').map(m => m.senderId))];
            const supplierIds = [...new Set(messages.filter(m => m.senderType === 'SUPPLIER').map(m => m.senderId))];

            const customers = await prisma.customer.findMany({
                where: { id: { in: customerIds } },
                select: { id: true, name: true }
            });

            const suppliers = await prisma.supplier.findMany({
                where: { id: { in: supplierIds } },
                select: { id: true, companyName: true }
            });

            // Format messages with names
            const formattedMessages = messages.map(msg => {
                let senderName = '';
                if (msg.senderType === 'CUSTOMER') {
                    const customer = customers.find(c => c.id === msg.senderId);
                    senderName = customer ? customer.name : 'Unknown Customer';
                } else {
                    const supplier = suppliers.find(s => s.id === msg.senderId);
                    senderName = supplier ? supplier.companyName : 'Unknown Supplier';
                }

                return {
                    id: msg.id,
                    senderId: msg.senderId,
                    senderName,
                    senderType: msg.senderType.toLowerCase(),
                    receiverId: msg.receiverId,
                    receiverType: msg.receiverType.toLowerCase(),
                    content: msg.content,
                    createdAt: msg.createdAt
                };
            });

            socket.emit('conversationHistory', {
                messages: formattedMessages,
                otherUser: {
                    id: parseInt(otherUserId),
                    type: otherUserType
                }
            });

        } catch (error) {
            console.error('Get conversation error:', error);
            socket.emit('error', { message: 'Failed to get conversation' });
        }
    });

    // Get user's conversations list
    socket.on('getConversations', async () => {
        try {
            const sender = connectedUsers.get(socket.id);

            if (!sender) {
                socket.emit('error', { message: 'User not authenticated' });
                return;
            }

            // Get all conversations for this user
            const conversations = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: sender.userId, senderType: sender.userType.toUpperCase() },
                        { receiverId: sender.userId, receiverType: sender.userType.toUpperCase() }
                    ]
                },
                orderBy: { createdAt: 'desc' }
            });

            // Group by conversation partner
            const conversationMap = new Map();

            conversations.forEach(msg => {
                let partnerId, partnerType;

                if (msg.senderId === sender.userId && msg.senderType === sender.userType.toUpperCase()) {
                    partnerId = msg.receiverId;
                    partnerType = msg.receiverType.toLowerCase();
                } else {
                    partnerId = msg.senderId;
                    partnerType = msg.senderType.toLowerCase();
                }

                const key = `${partnerType}_${partnerId}`;
                if (!conversationMap.has(key) || msg.createdAt > conversationMap.get(key).lastMessage) {
                    conversationMap.set(key, {
                        partnerId,
                        partnerType,
                        lastMessage: msg.createdAt,
                        lastContent: msg.content
                    });
                }
            });

            // Get partner details
            const customerIds = [];
            const supplierIds = [];

            conversationMap.forEach(conv => {
                if (conv.partnerType === 'customer') {
                    customerIds.push(conv.partnerId);
                } else {
                    supplierIds.push(conv.partnerId);
                }
            });

            const customers = await prisma.customer.findMany({
                where: { id: { in: customerIds } },
                select: { id: true, name: true, image: true }
            });

            const suppliers = await prisma.supplier.findMany({
                where: { id: { in: supplierIds } },
                select: { id: true, companyName: true, image: true }
            });

            // Format conversations
            const formattedConversations = Array.from(conversationMap.values()).map(conv => {
                let partner = null;
                if (conv.partnerType === 'customer') {
                    partner = customers.find(c => c.id === conv.partnerId);
                    return {
                        id: conv.partnerId,
                        name: partner ? partner.name : 'Unknown Customer',
                        type: 'customer',
                        image: partner ? partner.image : null,
                        lastMessage: conv.lastContent,
                        lastMessageTime: conv.lastMessage
                    };
                } else {
                    partner = suppliers.find(s => s.id === conv.partnerId);
                    return {
                        id: conv.partnerId,
                        name: partner ? partner.companyName : 'Unknown Supplier',
                        type: 'supplier',
                        image: partner ? partner.image : null,
                        lastMessage: conv.lastContent,
                        lastMessageTime: conv.lastMessage
                    };
                }
            }).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

            socket.emit('conversationsList', formattedConversations);

        } catch (error) {
            console.error('Get conversations error:', error);
            socket.emit('error', { message: 'Failed to get conversations' });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            console.log(`${user.userType} ${user.userId} disconnected`);
            connectedUsers.delete(socket.id);
        }
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    server.close();
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app, io };