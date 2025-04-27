const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')

const offlineStatus = async (req, res) => {
    const token = req.cookies['s-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'token not provide' })
    }

    let id

    try {
        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)

        id = decoded.id

    } catch (err) {
        console.log(err)
        return res.status.json({ status: false, message: 'invalid token' })
    }

    try {
        const isOnline = await prisma.supplier.update({
            where: { id: id },
            data: {
                isVerify: false
            }
        })

        let onlineStatus = isOnline.isVerify

        return res.status(200).json({ status: true, onlineStatus })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error!' })
    }
}


const onlineStatus = async (req, res) => {
    const token = req.cookies['s-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'token not provide' })
    }

    let id

    try {
        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)

        id = decoded.id

    } catch (err) {
        console.log(err)
        return res.status.json({ status: false, message: 'invalid token' })
    }

    try {
        const isOnline = await prisma.supplier.update({
            where: { id: id },
            data: {
                isVerify: true
            }
        })

        let onlineStatus = isOnline.isVerify

        return res.status(200).json({ status: true, onlineStatus })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error!' })
    }
}




module.exports = { onlineStatus, offlineStatus }