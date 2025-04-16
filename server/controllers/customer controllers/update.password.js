const jsw = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')
const bcrypt = require('bcrypt')

const updatePassword = async (req, res) => {


    const { password } = req.body

    const token = req.cookies['t-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'token not provide' })
    }

    const decoded = jsw.verify(token, process.env.CUSTOMER_KEY)

    const id = parseInt(decoded.id)

    const hashPssword = bcrypt.hash(password, 10)

    try {
        await prisma.customer.update({
            where: { id: id },
            data: { hashPssword }
        })
    }catch(err) {
        console.log(err)
        return res.status(500).json({status: false , message: 'server error'})
    }
}

module.exports = {updatePassword}