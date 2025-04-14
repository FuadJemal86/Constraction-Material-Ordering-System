const express = require('express')
const { getCustomerAccount } = require('../controllers/customer controllers/supplier.getProfile')
const { getCustomerOrder } = require('../controllers/customer controllers/supplier.getOrder')



const router = express.Router()

router.get('/my-account' , getCustomerAccount)
router.get('/get-order' , getCustomerOrder )

module.exports = router;