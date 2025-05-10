const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require("../../prismaCliaynt");

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, 'admin_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const editAdminProfile = [upload.single('image'), async (req, res) => {
    try {
        const token = req.cookies['a-auth-token'];
        if (!token) {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.ADMIN_PASSWORD);
        const adminId = decoded.id;
        const { name, email, password } = req.body;

        const currentAdmin = await prisma.admin.findUnique({
            where: { id: Number(adminId) },
            select: { name: true, email: true, image: true, password: true }
        });

        if (!currentAdmin) {
            return res.status(404).json({ status: false, message: 'Admin not found' });
        }

        const newImage = req.file ? req.file.filename : currentAdmin.image;

        if (email && email !== currentAdmin.email) {
            const existingAdmin = await prisma.admin.findFirst({
                where: {
                    email: email,
                    NOT: { id: Number(adminId) }
                }
            });

            if (existingAdmin) {
                return res.status(409).json({ status: false, message: 'Email already in use' });
            }
        }

        let newPassword = currentAdmin.password;
        if (password) {
            newPassword = await bcrypt.hash(password, 10);
        }

        const noChange =
            name === currentAdmin.name &&
            email === currentAdmin.email &&
            newPassword === currentAdmin.password &&
            newImage === currentAdmin.image;

        if (noChange) {
            return res.status(200).json({ status: false, message: 'No changes detected' });
        }

        // Perform the update
        await prisma.admin.update({
            where: { id: Number(adminId) },
            data: {
                name: name || currentAdmin.name,
                email: email || currentAdmin.email,
                password: newPassword,
                image: newImage
            }
        });

        return res.status(200).json({ status: true, message: 'Admin updated successfully!' });

    } catch (err) {
        console.error('Error updating admin:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
}];

module.exports = { editAdminProfile };
