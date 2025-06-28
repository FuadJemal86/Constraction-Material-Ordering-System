const prisma = require("../../prismaCliaynt")

// { month: 'Jan', new: 45, approved: 38, rejected: 7, active: 680 },

const supplierGrowth = async (req, res) => {

    try {
        const supplierData = await prisma.supplier.findMany({
            select: {
                createdAt: true,
                isApproved: true,
                isVerify: true,
                isActive: true
            }
        })

        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]

        const state = months.map((month, index) => {
            const neww = supplierData.filter(
                c => c.createdAt.getMonth() === index
            )

            const approved = supplierData.filter(
                c => c.createdAt.getMonth() === index && c.isApproved === 1
            )

            const rejected = supplierData.filter(c =>
                c.createdAt.getMonth() === index && c.isVerify === 0
            )

            const active = supplierData.filter(c =>
                c.createdAt.getMonth() === index && c.isApproved === 1 && c.isActive === 1
            )

            return {
                state: true,
                month,
                new: neww.length,
                approved: approved.length,
                rejected: rejected.length,
                active: active.length
            }
        })

        return res.status(200).json({ status: true, state })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: ' server error' })
    }
}

module.exports = { supplierGrowth }