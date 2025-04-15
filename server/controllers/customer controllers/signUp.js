const prisma = require("../../prismaCliaynt")
const bcrypt = require('bcrypt')



const custoemrSignUp =  async (req, res) => {
    try {

        const { name, email, password, phone } = req.body

        const isExist = await prisma.customer.findUnique({ where: { email } })

        if (isExist) {
            return res.status(401).json({ status: false, message: 'Account Already Exist' })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        await prisma.customer.create({
            data: { name, email, password: hashPassword, phone }
        })

        return res.status(200).json({ status: true, message: 'customer registed' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}


module.exports = {custoemrSignUp}