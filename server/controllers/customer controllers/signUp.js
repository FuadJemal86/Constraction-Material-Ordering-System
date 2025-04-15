const prisma = require("../../prismaCliaynt")
const bcrypt = require('bcrypt')
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



const custoemrSignUp = (upload.single('image'),async (req, res) => {
    try {

        const { name, email, password, phone , image  } = req.body



        const isExist = await prisma.customer.findUnique({ where: { email } })

        if (isExist) {
            return res.status(401).json({ status: false, message: 'Account Already Exist' })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        await prisma.customer.create({
            data: { name, email, password: hashPassword, phone  ,image}
        })

        return res.status(200).json({ status: true, message: 'customer registed' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


module.exports = { custoemrSignUp }