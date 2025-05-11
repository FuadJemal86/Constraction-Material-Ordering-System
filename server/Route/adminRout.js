const express = require('express');
const { adminLogin } = require('../controllers/admin controllers/admin.login');
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
const { getPaymentDetali } = require('../controllers/admin controllers/get.detail.payment');
const { deleteAccount } = require('../controllers/admin controllers/delete.account');
const { updatePaymentStatus } = require('../controllers/admin controllers/update.payment.status');
const { resubmit } = require('../controllers/admin controllers/askResubmit');
const { deletedCustomer } = require('../controllers/admin controllers/deleted.customer');
const { getOnlineSupplier } = require('../controllers/admin controllers/get.online.supplier');
const { removedSupplier } = require('../controllers/admin controllers/removed.supplier');
const { recycleSupplier } = require('../controllers/admin controllers/recycle.supplier');
const { removedCustomer } = require('../controllers/admin controllers/removed.customer');
const { recycleCustomer } = require('../controllers/admin controllers/recycle.customer');
const { adminGetAccount } = require('../controllers/admin controllers/admin.get.account');
const { editAdminProfile } = require('../controllers/admin controllers/editProfile');
const { getAdminProfileImage } = require('../controllers/admin controllers/getAdminProfileImage');
const router = express.Router();


router.post('/login', adminLogin);
router.post('/add-bank-account', addCompanyAccount)
router.post('/add-category', addCategory)
router.post('/resubmit/:id', resubmit)


router.get('/bank-accounts', getCompanyAccount)
router.get('/get-supplier', getSupplier)
router.get('/get-order', getOrder)
router.get('/get-order-item/:id', getOrderItem)
router.get('/get-category', getCategory)
router.get('/get-customer', getCustomer)
router.get('/get-payment', getPayment)
router.get('/get-deleted-customer', deletedCustomer)
router.get('/get-online-supplier', getOnlineSupplier)
router.get('/removed-supplier', removedSupplier)
router.get('/removed-customer', removedCustomer)
router.get('/get-detil-paymen/:transactionId', getPaymentDetali)
router.get('/get-account', adminGetAccount)
router.get('/admin-profile', getAdminProfileImage)


router.put('/delete-supplier/:id', deleteSupplier)
router.put('/delete-customer/:id', deleteCustomer)
router.put('/recycle-supplier/:id', recycleSupplier)
router.put('/recycle-customer/:id', recycleCustomer)
router.put('/update-supplier/:id', updatedSupplier)
router.put('/update-payment-status/:id', updatePaymentStatus)
router.put('/update-supplier-status/:supplierId', updateCustomerApprove)
router.put('/update-order-status/:id', updateOrderStatus)
router.put('/edit-profile', editAdminProfile)





router.delete('/delete-category/:id', deleteCategory)
router.delete('/delete-order/:id', orderdelete)
router.delete('/delete-bank-account/:id', deleteAccount)


module.exports = router;
