const express = require('express')
const { Login } = require('../controllers/supperAdmin/login')
const { addSupperAdminAccount } = require('../controllers/supperAdmin/add.supper.admin')
const { getAllAdmins } = require('../controllers/supperAdmin/getAdmis')
const { addAccount } = require('../controllers/supperAdmin/admin.addAccount')
const { deleteAdminAccount } = require('../controllers/supperAdmin/delete.admin.account')
const { updateAdmin } = require('../controllers/supperAdmin/update.admin')
const { authSupper, supperAdmin } = require('../middleware/auth')
const { logout } = require('../controllers/supperAdmin/logout')
const { validation } = require('../controllers/supperAdmin/validation')


// middleware


const router = express.Router()

// router.post('/login', Login)

router.use(authSupper, supperAdmin);


router.put('/edit-admin/:id', updateAdmin)
router.get('/get-admins', getAllAdmins)
router.post('/add-supper-admin', addSupperAdminAccount)
router.post('/add-admin-account', addAccount)
router.delete('/remove-admins/:id', deleteAdminAccount)
router.post('/validate', validation)

// logout
router.post('/logout', logout)




module.exports = router