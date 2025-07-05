const express = require('express')
const { getCustomerAccount } = require('../controllers/customer controllers/supplier.getProfile')
const { getCustomerOrder } = require('../controllers/customer controllers/supplier.getOrder')
const { customerSignUp } = require('../controllers/customer controllers/signUp')
const { customerLogin } = require('../controllers/customer controllers/login')
const { verifyCustomerToken } = require('../controllers/customer controllers/validate.token')
const { customerGetCategory } = require('../controllers/customer controllers/get.categoty')
const { getSupplier } = require('../controllers/customer controllers/get.suppliers')
const { customerPlaceOrder } = require('../controllers/customer controllers/place.order')
const { customerGetTransaction } = require('../controllers/customer controllers/get.transaction')
const { customerPayment } = require('../controllers/customer controllers/payment')
const { customerNearbt } = require('../controllers/customer controllers/get.nearby')
const { getCustomerPayment } = require('../controllers/customer controllers/get.paymentStatus')
const { getProduct } = require('../controllers/customer controllers/get.products')
const { getPendingOrder } = require('../controllers/customer controllers/customer.pending.payment')
const { getAccount } = require('../controllers/customer controllers/get.account')
const { editCustomerProfile } = require('../controllers/supplier controllers/edit.account')
const { updatePassword } = require('../controllers/customer controllers/update.password')
const { getCustomerOrderItem } = require('../controllers/customer controllers/get.orderItem')
const { getCustomerPaymentStatus } = require('../controllers/customer controllers/get.payment')
const { getTransactionPayment } = require('../controllers/customer controllers/get.transactionPayment')
const { getProfile } = require('../controllers/customer controllers/get.profile')
const { getProductStock } = require('../controllers/customer controllers/get.stock.product')
const { getNotifaction } = require('../controllers/customer controllers/customerGetNoti')
const { notificationRed } = require('../controllers/customer controllers/notifactionRed')
const { markAsAllRed } = require('../controllers/customer controllers/markAsRead')
const { validation } = require('../controllers/customer controllers/validation')
const { logout } = require('../controllers/customer controllers/logOut')
const { authCustomer, customer } = require('../middleware/auth')
const { checkEmail } = require('../controllers/customer controllers/forgotPassword')



// middleware


const router = express.Router()

// Public Routes
router.get('/get-products/:id', getProduct)
router.get('/get-supplier', getSupplier)
router.get('/get-category', customerGetCategory)
router.get('/nearby-suppliers', customerNearbt)

router.post('/login', customerLogin)
router.post('/sign-up', customerSignUp)
router.post('/check-email', checkEmail)

// Protected Routes

router.use(authCustomer, customer);


router.get('/my-account', getCustomerAccount)
router.get('/get-order', getCustomerOrder)
router.get('/verify-token', verifyCustomerToken)
router.get('/get-notifications', getNotifaction)
router.get('/get-transitionId', customerGetTransaction)
router.get('/get-payment-status', getCustomerPayment)
router.get('/get-products/:id', getProduct)
router.get('/get-pending-payment/:id', getPendingOrder)
router.get('/get-account', getAccount)
router.get('/get-order-item/:id', getCustomerOrderItem)
router.get('/get-payment', getCustomerPaymentStatus)
router.get('/get-transaction/:transactionId', getTransactionPayment)
router.get('/profile', getProfile)
router.get('/get-products-stock', getProductStock)


router.post('/place-order', customerPlaceOrder)
router.post('/make-payment/:transactionId', customerPayment)
router.post('/validate', validation)
router.post('/logout', logout, { withCredentials: true })


router.put('/update-customer-account', editCustomerProfile)
router.put('/password-change', updatePassword)
router.put('/notifications/:id/read', notificationRed)
router.put('/notifications/mark-all-read', markAsAllRed)






module.exports = router;