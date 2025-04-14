// add account

const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken')

const addAcount =  async (req, res) => {

    const token = req.cookies['s-auth-token']

    if (!token) {
        return res.status(401).json({ valid: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)

    const supplierId = decoded.id

    const { bankName, account } = req.body

    if (!bankName || !account) {
        return res.status(400).json({ status: false, message: 'pleas fill the feild' })
    }

    try {
        await prisma.bank.create({
            data: {
                supplierId,
                bankName,
                account
            }
        })

        return res.status(200).json({ status: true, message: 'account added' })
    } catch (err) {
        console.log(err)
        return res.status(500).json('server error')
    }

}

module.exports = {addAcount}