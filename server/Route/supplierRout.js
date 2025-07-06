const express = require('express')
const { supplierUp } = require('../controllers/supplier controllers/supplier.signUp')
const { supplierLogin } = require('../controllers/supplier controllers/supplier.login')
const { getCategory } = require('../controllers/supplier controllers/supplier.getCategory')
const { addProduct } = require('../controllers/supplier controllers/add.product')
const { deleteProduct } = require('../controllers/supplier controllers/delete.product')
const { updateProduct } = require('../controllers/supplier controllers/update.product')
const { getAccount } = require('../controllers/supplier controllers/get.account')
const { addAcount } = require('../controllers/supplier controllers/add.account')
const { deleteAccount } = require('../controllers/supplier controllers/delete.account')
const { getOrder } = require('../controllers/supplier controllers/get.order')
const { updateOrderStatus } = require('../controllers/supplier controllers/update.status.order')
const { getPayment } = require('../controllers/supplier controllers/getPyment')
const { getOrderItem } = require('../controllers/supplier controllers/get.orderItem')
const { getProduct } = require('../controllers/supplier controllers/get.product')
const { supplierVerify } = require('../controllers/supplier controllers/supplier.verifay')
const { uplodeSupplierVerification } = require('../controllers/supplier controllers/uploding.detail.verification')
const { chekReviw } = require('../controllers/supplier controllers/is.reviw')
const { supplierData } = require('../controllers/supplier controllers/supplier.detail')
const { onlineStatus, offlineStatus } = require('../controllers/supplier controllers/isSupplier.online')
const { donePayment } = require('../controllers/supplier controllers/get.done.payment')
const { supplierProfile } = require('../controllers/supplier controllers/get.supplier.account')
const { editSupplierProfile } = require('../controllers/supplier controllers/edit.Supplier.profile')
const { getSupplierProfileImage } = require('../controllers/supplier controllers/get.supplier.image')
const { completedPaymentOrderItem } = require('../controllers/supplier controllers/getCompletedOrderItem')
const { getNotifaction } = require('../controllers/supplier controllers/getNotification')
const { notificationRed } = require('../controllers/supplier controllers/notificationRed')
const { markAsAllRed } = require('../controllers/supplier controllers/markAllRed')
const { totalRevenue } = require('../controllers/supplier controllers/totalRevenu')
const { totalOrder } = require('../controllers/supplier controllers/totalOrder')
const { totalProduct } = require('../controllers/supplier controllers/totalProduct')
const { totalCustomer } = require('../controllers/supplier controllers/totalCustomer')
const { pendingOrder } = require('../controllers/supplier controllers/pendingOrder')
const { totalProseOrderBirr } = require('../controllers/supplier controllers/totalOrderPros')
const { returnRate } = require('../controllers/supplier controllers/return.rate')
const { doneOrder } = require('../controllers/supplier controllers/doneOrder')
const { chartData } = require('../controllers/supplier controllers/chartData')
const { piChartData } = require('../controllers/supplier controllers/pischartData')
const { validation } = require('../controllers/supplier controllers/validation')
const { logout } = require('../controllers/supplier controllers/logOut')
const { authSupplier, supplier } = require('../middleware/auth')
const { checkEmail } = require('../controllers/supplier controllers/forgotPassword')


// middleware


const router = express.Router()

router.post('/sign-up', supplierUp)
router.post('/login', supplierLogin)
router.post('/check-email', checkEmail)

router.post('/logout', logout)


router.use(authSupplier, supplier);



router.post('/supplier-verifing', uplodeSupplierVerification)
router.post('/add-product', addProduct)
router.post('/add-account', addAcount)


router.put('/update-order-status/:id', updateOrderStatus)
router.put('/offline', offlineStatus)
router.put('/update-product/:id', updateProduct)
router.put('/online', onlineStatus)
router.put('/edit-profile', editSupplierProfile)
router.put('/notifications/:id/read', notificationRed)
router.put('/notifications/mark-all-read', markAsAllRed)

router.delete('/delete-product/:id', deleteProduct)
router.delete('/delete-account/:id', deleteAccount)


router.get('/get-account', getAccount)
router.get('/get-order', getOrder)
router.get('/get-category', getCategory)
router.get('/get-payment', getPayment)
router.get('/get-order-item/:id', getOrderItem)
router.get('/get-product', getProduct)
router.get('/is-verify', supplierVerify)
router.get('/chek-reviw', chekReviw)
router.get('/supplier-data/:id', supplierData)
router.get('/get-completed-payment', donePayment)
router.get('/get-supplier-profile', supplierProfile)
router.get('/supplier-profile', getSupplierProfileImage)
router.get('/get-done-item/:id', completedPaymentOrderItem)
router.get('/get-notifications', getNotifaction)



// dashboard data

router.get('/get-total-birr', totalRevenue)
router.get('/get-total-order', totalOrder)
router.get('/get-total-product', totalProduct)
router.get('/get-total-customer', totalCustomer)
router.get('/get-pending-order', pendingOrder)
router.get('/get-total-orderProc', totalProseOrderBirr)
router.get('/get-return-rate', returnRate)
router.get('/get-done-order', doneOrder)
router.get('/get-chart-data', chartData)
router.get('/get-pi-chart-data', piChartData)


// validation
router.post('/validate', validation)

module.exports = router