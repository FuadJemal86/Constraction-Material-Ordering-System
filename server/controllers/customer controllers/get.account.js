const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')

const getAccount = async (req, res) => {

    const token = req.cookies['x-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provide' })
    }

    const decoded = jwt.verify(token, process.env.CUSTOMER_KEY)

    if (!decoded) {
        return res.status(400).json({ status: false, message: 'invalid token' })
    }

    try {

        const accounts = await prisma.bankAccount.findMany()

        return res.status(200).json({ status: true, accounts })

    } catch (err) {
        console.error(err);
        res.status(500).json({ loginStatus: false, message: 'server error' });
    }
}

module.exports = {getAccount}

