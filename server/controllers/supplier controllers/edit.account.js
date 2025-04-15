const prisma = require("../../prismaCliaynt")
const jwt = require('jsonwebtoken')


const editCustomerProfile = async (req, res) => {

    const token = req.cookies['x-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'token not provide' })
    }

    const decoded = jwt.verify(token, process.env.CUSTOMER_KEY)

    const id = parseInt(decoded.id)

    const { name, email, phone } = req.body


    try {

        const isExist = await prisma.customer.findUnique({
            where: { email: email }
        })

        if (!isExist) {
            return res.status(400).json({ status: false, message: 'user not found!' })
        }

        const updateData = {
            name: name,
            email: email,
            phone: phone
        }
        await prisma.customer.update({
            where: { id: id },
            data: updateData

        })

        return res.status(200).json({ status: true, message: 'update succsess' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error!' })
    }
}

module.exports = { editCustomerProfile }