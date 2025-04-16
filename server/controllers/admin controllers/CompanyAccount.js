const prisma = require("../../prismaCliaynt")


const addCompanyAccount = async(req , res)  => {

    const {bank_name , account_number} = req.body

    try {
        const isAccountExist = await prisma.bankAccount.findFirst({
            where: {name: bank_name  , accountNumber: account_number}
        })

        if(isAccountExist) {
            return res.status(400).json({status: false , message: 'account aleady exist'})
        }

        const accountData = {
            name: bank_name,
            accountNumber: account_number
        }

        await prisma.bankAccount.create({
            data : accountData
        })

        return res.status(201).json({status: true , message : 'Bank account added successfully'})
    } catch(err) {
        console.log(err)
        return res.status(500).json({status: false , message : 'server error'})
    }
} 

module.exports = {addCompanyAccount}