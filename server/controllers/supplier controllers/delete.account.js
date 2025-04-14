const prisma = require("../../prismaCliaynt");


const deleteAccount =  async (req, res) => {

    const { id } = req.params


    try {
        const bankRecord = await prisma.bank.findMany({
            where: { id: Number(id) }
        });

        if (!bankRecord) {
            return res.status(404).json({ message: "Bank record not found." });
        }

        await prisma.bank.delete({ where: { id: Number(id) } });
        res.status(200).json({ status: true, message: "Bank record deleted successfully." });


    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}


module.exports = {deleteAccount}