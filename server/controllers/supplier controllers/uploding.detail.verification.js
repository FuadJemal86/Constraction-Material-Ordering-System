const jwt = require('jsonwebtoken')
const prisma = require('../../prismaCliaynt')
const multer = require('multer')
const path = require('path');

// ulode image

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


const uplodeSupplierVerification = [upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'license', maxCount: 1 }])
    , async (req, res) => {
        const token = req.cookies['s-auth-token']

        if (!token) {
            return res.status(400).json({ status: false, message: 'token not provide' })
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.SUPPLIER_KEY);
        } catch (error) {
            return res.status(401).json({ status: false, message: 'Invalid token' });
        }


        const supplierId = decoded.id

        const photo = req.files?.photo?.[0]?.filename || null;
        const license = req.files?.license?.[0]?.filename || null;


        if (!photo || !license) {
            return res.status(400).json({ status: false, message: 'Both files must be uploaded' });
        }


        const supplierdata = {
            userImage: photo,
            licenseFile: license,
        }


        if (!photo || !license) {
            return res.status(400).json({ status: false, message: 'both fild must be field' })
        }

        try {
            const isExist = await prisma.supplierVerifiy.findFirst({
                where: { supplierId: supplierId }
            })

            if (isExist) {
                await prisma.supplierVerifiy.update({
                    where: { supplierId: supplierId },

                    data: {
                        userImage: photo,
                        licenseFile: license,
                        isReviw: true
                    }

                })
                return res.status(200).json({ status: true, message: 'supplier data successfuly updated!' })
            } else {
                await prisma.supplierVerifiy.create({
                    data: {
                        ...supplierdata,
                        supplierId
                    }
                });

                return res.status(200).json({ status: true, message: 'supplier data successfuly inserted!' })

            }

        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: false, error: 'Internal Server Error' });
        }
    }]

module.exports = { uplodeSupplierVerification }