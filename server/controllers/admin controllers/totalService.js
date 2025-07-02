const prisma = require("../../prismaCliaynt")

const totalServiceBirr = async (req, res) => {
    try {
        const totalBirr = await prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { service: true }

        })

        const totalServicePayment = totalBirr._sum.service

        if (totalServicePayment === 0) {
            return res.status(400).json({ status: false, message: 'no service birr  found' })
        }

        return res.status(200).json({ status: true, totalServicePayment })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { totalServiceBirr }