const prisma = require("../../prismaCliaynt")

//get  category


const customerGetCategory = async (req, res) => {
    try {
        const category = await prisma.category.findMany()

        if (!category) {
            return res.status(400).json({ status: false, message: "category not found" })
        }

        return res.status(200).json({ status: true, category })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, message: 'server error' })
    }
}


module.exports = { customerGetCategory }