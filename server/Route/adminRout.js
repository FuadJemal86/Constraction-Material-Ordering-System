const express = require('express');
const { adminLogin } = require('../controllers/admin controllers/admin.login');
const { addAccount } = require('../controllers/admin controllers/admin.addAccount');
const router = express.Router();


router.post('/login', adminLogin);
router.post('/add-account' , addAccount)

module.exports = router;
