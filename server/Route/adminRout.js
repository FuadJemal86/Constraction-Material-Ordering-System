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
const { updatePayedStatus } = require('../controllers/admin controllers/updatePayedStatus');
const { getAllConversations } = require('../controllers/admin controllers/getAllMessage');
const { getTotalSupplier } = require('../controllers/admin controllers/getAllSupplier');
const { getTotalCustomer } = require('../controllers/admin controllers/totalCustomer');
const { getAllCategory } = require('../controllers/admin controllers/allCategory');
const { getActiveSupplier } = require('../controllers/admin controllers/activeSupplier');
const { getPendingSupplier } = require('../controllers/admin controllers/pendingSuppliers');
const { getRejectedSupplier } = require('../controllers/admin controllers/rejectedSupplier');
const { getNewCustomer } = require('../controllers/admin controllers/newCustomer');
const { totalOrder } = require('../controllers/admin controllers/totalOrder');
const { totalBirr } = require('../controllers/admin controllers/totalBirr');
const { getRecentCustomer } = require('../controllers/admin controllers/recentCustomer');
const { totalServiceBirr } = require('../controllers/admin controllers/totalService');
const { getCustomerStats } = require('../controllers/admin controllers/customerGrowth');
const { getSystemPerformance } = require('../controllers/admin controllers/getSystemPerformance');
const { supplierGrowth } = require('../controllers/admin controllers/supplierGrowth');
const { validation } = require('../controllers/admin controllers/validation');
const { logout } = require('../controllers/admin controllers/logOut');
const { deleteSuppliers } = require('../controllers/admin controllers/deleteSupplier');
const { deleteCustomers } = require('../controllers/admin controllers/deleteCustomer');
const { authAdmin, admin } = require('../middleware/auth');


const router = express.Router();




router.post('/login', adminLogin);
router.get('/get-conversation', getAllConversations)

// middleware
router.use(authAdmin, admin);


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

// Dashboard info
router.get('/get-total-supplier', getTotalSupplier)
router.get('/get-total-customer', getTotalCustomer)
router.get('/get-all-category', getAllCategory)
router.get('/get-active-supplier', getActiveSupplier)
router.get('/get-pending-supplier', getPendingSupplier)
router.get('/get-rejected-supplier', getRejectedSupplier)
router.get('/get-new-customer', getNewCustomer)
router.get('/total-order', totalOrder)
router.get('/total-birr', totalBirr)
router.get('/recent-customer', getRecentCustomer)
router.get('/total-service-birr', totalServiceBirr)
router.get('/customer-growth', getCustomerStats)
router.get('/get-system-performance', getSystemPerformance)
router.get('/get-supplier-growth', supplierGrowth)


router.put('/delete-supplier/:id', deleteSupplier)
router.put('/delete-customer/:id', deleteCustomer)
router.put('/recycle-supplier/:id', recycleSupplier)
router.put('/recycle-customer/:id', recycleCustomer)
router.put('/update-supplier/:id', updatedSupplier)
router.put('/update-payment-status/:id', updatePaymentStatus)
router.put('/update-supplier-status/:supplierId', updateCustomerApprove)
router.put('/update-order-status/:id', updateOrderStatus)
router.put('/edit-profile', editAdminProfile)
router.put('/update-payed-status/:id', updatePayedStatus)





router.delete('/delete-category/:id', deleteCategory)
router.delete('/delete-order/:id', orderdelete)
router.delete('/delete-bank-account/:id', deleteAccount)
router.delete('/hard-delete-supplier/:id', deleteSuppliers)
router.delete('/hard-delete-customer/:id', deleteCustomers)

// validation

router.post('/validate', validation)

// logout

router.post('/logout', logout)


module.exports = router;
