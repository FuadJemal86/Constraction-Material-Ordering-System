const express = require('express');
const { adminLogin } = require('../controllers/admin controllers/admin.login');
const { addAccount } = require('../controllers/admin controllers/admin.addAccount');
const { addCompanyAccount } = require('../controllers/admin controllers/CompanyAccount');
const { getCompanyAccount } = require('../controllers/admin controllers/get.company.account');
const { getSupplier } = require('../controllers/admin controllers/get.supplier');
const router = express.Router();


router.post('/login', adminLogin);
router.post('/add-account' , addAccount)
router.post('/add-bank-account' , addCompanyAccount)
router.get('/bank-accounts' , getCompanyAccount)
router.get('/get-supplier' , getSupplier)

module.exports = router;
