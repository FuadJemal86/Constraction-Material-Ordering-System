const express = require('express');
const getCustomerAccount = require('../controllers/supplier controllers/supplier.getProfile');

const router = express.Router();


router.get('/get-account' , getCustomerAccount)


module.exports = router

