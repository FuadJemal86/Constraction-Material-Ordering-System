const express = require('express')
const { getCustomerAccount } = require('../controllers/customer controllers/supplier.getProfile')
const { getCustomerOrder } = require('../controllers/customer controllers/supplier.getOrder')
const { custoemrSignUp } = require('../controllers/customer controllers/signUp')
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




const router = express.Router()

router.post('/sign-up', custoemrSignUp)

router.get('/my-account', getCustomerAccount)
router.get('/get-order', getCustomerOrder)

router.post('/login', customerLogin)

router.get('/verify-token', verifyCustomerToken)
router.get('/get-category', customerGetCategory)
router.get('/get-supplier', getSupplier)
router.get('/get-notifications', getNotifaction)


router.post('/place-order', customerPlaceOrder)

router.get('/get-transitionId', customerGetTransaction)

router.post('/make-payment/:transactionId', customerPayment)

router.get('/get-payment-status', getCustomerPayment)
router.get('/nearby-suppliers', customerNearbt)
router.get('/get-products/:id', getProduct)
router.get('/get-pending-payment/:id', getPendingOrder)
router.get('/get-account', getAccount)

router.put('/update-customer-account', editCustomerProfile)
router.put('/password-change', updatePassword)
router.put('/notifications/:id/read', notificationRed)
router.put('/notifications/mark-all-read', markAsAllRed)

router.get('/get-order-item/:id', getCustomerOrderItem)
router.get('/get-payment', getCustomerPaymentStatus)
router.get('/get-transaction/:transactionId', getTransactionPayment)
router.get('/profile', getProfile)
router.get('/get-products-stock', getProductStock)


// validation 

router.post('/validate', validation)

// logout

router.post('/logout', logout)





module.exports = router;