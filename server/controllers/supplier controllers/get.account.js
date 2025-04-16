// get-account

const prisma = require("../../prismaCliaynt");
const jwt = require('jsonwebtoken')


const getAccount = async (req, res) => {

    const token = req.cookies['s-auth-token'];

    if (!token) {
        return res.status(401).json({ valid: false, message: "Unauthorized: No token provided" });
    }
    try {

        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY)
        const supplierId = decoded.id


        const account = await prisma.bank.findMany({
            where: { supplierId: supplierId },
        });

        return res.status(200).json({ status: true, result: account })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}


module.exports = { getAccount }