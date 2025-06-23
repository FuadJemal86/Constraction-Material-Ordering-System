const prisma = require("../../prismaCliaynt")

const getRecentCustomer = async (req, res) => {
    try {
        const lastFiveCustomers = await prisma.order.findMany({
            orderBy: {
                id: 'desc',
            },
            take: 5,

            include: {
                customer: {
                    select: {
                        name: true,
                        isActive: true
                    }
                }
            }
        });



        if (lastFiveCustomers === 0) {
            return res.status(400).json({ status: false, message: 'no customer  found' })
        }

        return res.status(200).json({ status: true, lastFiveCustomers })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getRecentCustomer }