const prisma = require("../../prismaCliaynt")


const getOnlineSupplier = async (req, res) => {
    try {
        const onlineSupplier = await prisma.supplier.findMany({
            where: {
                isActive: true,
                isApproved: true,
                isVerify: true
            },
            select: {
                id: true,
                companyName: true,
                phone: true,
                licenseNumber: true,
                tinNumber: true,
                email: true
            }
        })

        return res.status(200).json({ status: true, onlineSupplier })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getOnlineSupplier }