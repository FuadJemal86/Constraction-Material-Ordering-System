const prisma = require("../../prismaCliaynt")
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path');

// uplode images

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


const editCustomerProfile = [upload.single('image') , async (req, res) => {

    const token = req.cookies['x-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'token not provide' })
    }

    const decoded = jwt.verify(token, process.env.CUSTOMER_KEY)

    const id = parseInt(decoded.id)

    const { name, email, phone } = req.body


    try {

        const isExist = await prisma.customer.findFirst({
            where: {
                email,
                NOT: { id }
            }
        });

        if (isExist) {
            return res.status(400).json({ status: false, message: 'Email is already taken' });
        }

        const updateData = {
            name: name?.trim(),
            email: email?.trim(),
            phone: phone?.trim(),

        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        console.log(updateData)
        await prisma.customer.update({
            where: { id: id },
            data: updateData

        })

        return res.status(200).json({ status: true, message: 'update succsess' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error!' })
    }
}]

module.exports = { editCustomerProfile }