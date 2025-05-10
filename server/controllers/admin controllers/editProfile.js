
const path = require('path')
const multer = require('multer')
const jwt = require('jsonwebtoken')

// update customer

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

const editAdminProfile = [upload.single('image'), async (req, res) => {
    try {

        let adminId

        const token = req.cookies['supper-token']

        if (!token) {
            return res.status(401).json({ status: false, message: false })
        }

        const decoded = jwt.verify(token, process.env.ADMIN_PASSWORD)

        adminId = decoded.id

        const { name, email, password } = req.body;

        if (!password) {
            await prisma.admin.update({
                where: { id: Number(adminId) },
                data: {
                    name,
                    email,
                    image: req.file ? req.file.filename : null
                }
            });

            return res.status(200).json({ status: true, message: 'admin updated successfully!' });
        } else {
            await prisma.admin.update({
                where: { id: Number(adminId) },
                data: {
                    name,
                    email,
                    password,
                    image: req.file ? req.file.filename : null
                }
            });

            return res.status(200).json({ status: true, message: 'admin updated successfully!' });
        }

    } catch (err) {
        console.error('Error updating supplier:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
}]


module.exports = { editAdminProfile }