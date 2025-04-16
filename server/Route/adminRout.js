const express = require('express');
const { adminLogin } = require('../controllers/admin controllers/admin.login');
const { addAccount } = require('../controllers/admin controllers/admin.addAccount');
const { addCompanyAccount } = require('../controllers/admin controllers/CompanyAccount');
const { getCompanyAccount } = require('../controllers/admin controllers/get.company.account');
const router = express.Router();


router.post('/login', adminLogin);
router.post('/add-account' , addAccount)
router.post('/add-bank-account' , addCompanyAccount)
router.get('/bank-accounts' , getCompanyAccount)

module.exports = router;
