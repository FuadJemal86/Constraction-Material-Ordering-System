// update product

const prisma = require("../../prismaCliaynt");
const multer = require('multer')
const path = require('path');

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

const updateProduct = [upload.single('image'), async (req, res) => {

    try {
        const { id } = req.params;
        const { name, price, stock, supplierId, categoryId } = req.body;

        const existingProduct = await prisma.product.findUnique({ where: { id: Number(id) } });
        if (!existingProduct) {
            return res.status(404).json({ status: false, message: 'Product not found' });
        }

        const updateData = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            supplierId: parseInt(supplierId),
            categoryId: parseInt(categoryId),
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        await prisma.product.update({
            where: { id: Number(id) },
            data: updateData
        });

        return res.status(200).json({ status: true, message: 'Product updated successfully!' });

    } catch (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
}];


module.exports = {updateProduct}