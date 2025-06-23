const prisma = require("../../prismaCliaynt")

const totalBirr = async (req, res) => {
    try {
        const totalBirr = await prisma.payment.aggregate({
            _sum: { amount: true }

        })

        const totalPayment = totalBirr._sum.amount

        if (totalPayment === 0) {
            return res.status(400).json({ status: false, message: 'no birr  found' })
        }

        return res.status(200).json({ status: true, totalPayment })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { totalBirr }