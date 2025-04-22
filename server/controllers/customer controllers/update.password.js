const jsw = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')
const bcrypt = require('bcryptjs');


const updatePassword = async (req, res) => {


    const { password } = req.body

    const token = req.cookies['x-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'token not provide' })
    }

    const decoded = jsw.verify(token, process.env.CUSTOMER_KEY)

    const id = parseInt(decoded.id)

    const hashPassword = await bcrypt.hash(password, 10)

    try {
        await prisma.customer.update({
            where: { id: id },
            data: { password: hashPassword }
        })
        return res.status(200).json({status: true , message: 'password updated'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { updatePassword }