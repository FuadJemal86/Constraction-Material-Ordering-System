const prisma = require("../../prismaCliaynt");
const multer = require('multer')
const path = require('path');
const jwt = require('jsonwebtoken')




// uplode images

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

const addProduct = [upload.single('image'), async (req, res) => {
    try {

        const token = req.cookies["s-auth-token"];
        if (!token) {
            return res.status(401).json({ status: false, message: 'Unauthorized, no token found' });
        }

        const decoded = jwt.verify(token, process.env.SUPPLIER_KEY);
        const supplierId = decoded.id;

        const { name, price, stock, categoryId, unit, deliveryPricePerKm } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: false, message: 'Image is required' });
        }

        const chekSupplier = await prisma.supplier.findFirst({
            where: { id: supplierId },
            select: {
                isActive: true,
                isApproved: true
            }
        })

        if (!chekSupplier.isActive || !chekSupplier.isApproved) {
            return res.status(400).json({ status: false, message: 'Your account is restricted. Please contact admin.' });
        }


        await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                supplierId,
                categoryId: parseInt(categoryId),
                unit,
                deliveryPricePerKm: parseFloat(deliveryPricePerKm),
                image: req.file ? req.file.filename : null,
            },
        })

        return res.status(200).json({ status: 200, message: 'product add' })


    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: 'Server error' });
    }
}];

module.exports = { addProduct }