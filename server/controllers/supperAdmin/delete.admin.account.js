const prisma = require("../../prismaCliaynt")


const deleteAdminAccount = async (req, res) => {
    const id = parseInt(req.params.id)

    if (!id) {
        return res.status(400).json({ status: false, message: 'id id requird' })
    }

    try {
        const admin = await prisma.admin.delete({
            where: { id: id }
        })
        return res.status(200).json({ status: true, message: 'Admin Deleted succsessfuly' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { deleteAdminAccount }