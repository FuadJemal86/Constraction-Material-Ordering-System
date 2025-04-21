

// add category

const prisma = require("../../prismaCliaynt")

const addCategory =  async (req, res) => {
    try {
        const { category } = req.body

        const ifExist = await prisma.category.findUnique({ where: { category } })

        if (ifExist) {
            return res.status(401).json({ status: false, message: 'category already exist' })
        }

        await prisma.category.create({
            data: { category }
        })
        return res.status(200).json({ status: true, message: 'category added' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = {addCategory}