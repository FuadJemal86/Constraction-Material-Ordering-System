const prisma = require("../../prismaCliaynt");


// get supplier products



const getAllProduct = async (req, res) => {

    try {

        const product = await prisma.product.findMany();

        if (product.length == 0) {
            return res.status(400).json({ status: false, message: "No product found" })
        }

        return res.status(200).json({ status: true, product })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { getAllProduct }