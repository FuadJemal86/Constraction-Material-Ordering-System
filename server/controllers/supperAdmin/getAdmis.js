const prisma = require("../../prismaCliaynt")


const getAllAdmins = async (req, res) => {
    try {
        const admis = await prisma.admin.findMany({
            select: {
                name: true,
                email: true,
                image: true
            }
        })

        if (!admis) {
            return res.status(400).json({ status: false, message: 'admin not found' })
        }

        return res.status(200).json({ status: true, admis })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getAllAdmins }