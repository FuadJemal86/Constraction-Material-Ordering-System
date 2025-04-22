const prisma = require("../../prismaCliaynt");
const bcrypt = require('bcryptjs');

const addAccount = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    try {

        const existhingUsr = await prisma.admin.findUnique({ where: { email } })

        if (existhingUsr) {
            return res.status(400).json({ status: false, message: 'Account Already Exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const account = await prisma.admin.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ status: true, message: 'Account added successfully' });

    } catch (err) {
        console.error("server error:", err.message);
        res.status(500).json({ status: false, error: err.message });
    }
};

module.exports = { addAccount }