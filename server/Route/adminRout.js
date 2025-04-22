const express = require('express');
const { adminLogin } = require('../controllers/admin controllers/admin.login');
const { addAccount } = require('../controllers/admin controllers/admin.addAccount');
const { addCompanyAccount } = require('../controllers/admin controllers/CompanyAccount');
const { getCompanyAccount } = require('../controllers/admin controllers/get.company.account');
const { getSupplier } = require('../controllers/admin controllers/get.supplier');
const { deleteSupplier } = require('../controllers/admin controllers/delete.supplier');
const { updateCustomerApprove } = require('../controllers/admin controllers/update.customerApprove');
const { updatedSupplier } = require('../controllers/admin controllers/update.supplier');
const { deleteCustomer } = require('../controllers/admin controllers/delete.customer');
const { getOrder } = require('../controllers/admin controllers/get.order');
const { getOrderItem } = require('../controllers/admin controllers/getOrder.item');
const { updateOrderStatus } = require('../controllers/admin controllers/update.order.status');
const { addCategory } = require('../controllers/admin controllers/add.category');
const { getCategory } = require('../controllers/admin controllers/get.category');
const deleteCategory = require('../controllers/admin controllers/delete.category');
const { getPayment } = require('../controllers/admin controllers/get.payment');
const { getCustomer } = require('../controllers/admin controllers/get.customer');
const { orderdelete } = require('../controllers/admin controllers/delete.order');
const router = express.Router();


router.post('/login', adminLogin);
router.post('/add-account' , addAccount)
router.post('/add-bank-account' , addCompanyAccount)
router.post('/add-category' , addCategory)
router.get('/bank-accounts' , getCompanyAccount)
router.get('/get-supplier' , getSupplier)
router.get('/get-order' , getOrder)
router.get('/get-order-item/:id' , getOrderItem)
router.get('/get-category' , getCategory)
router.get('/get-customer'  ,getCustomer)
router.get('/get-payment' , getPayment)
router.put('/delete-supplier/:id' , deleteSupplier)
router.put('/delete-customer/:id' , deleteCustomer)
router.delete('/delete-category/:id' , deleteCategory)
router.delete('/delete-order/:id' , orderdelete)
router.put('/update-supplier/:id' , updatedSupplier)
router.put('/update-order-status/:id' , updateOrderStatus)
router.put('/update-supplier-status/:supplierId' , updateCustomerApprove)

module.exports = router;
