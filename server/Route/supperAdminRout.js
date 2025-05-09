const express = require('express')
const { Login } = require('../controllers/supperAdmin/login')
const { addSupperAdminAccount } = require('../controllers/supperAdmin/add.supper.admin')
const { getAllAdmins } = require('../controllers/supperAdmin/getAdmis')
const { addAccount } = require('../controllers/supperAdmin/admin.addAccount')
const { deleteAdminAccount } = require('../controllers/supperAdmin/delete.admin.account')
const { updateAdmin } = require('../controllers/supperAdmin/update.admin')

const router = express.Router()

router.put('/edit-admin/:id', updateAdmin)
router.post('/login', Login)
router.get('/get-admins', getAllAdmins)
router.post('/add-supper-admin', addSupperAdminAccount)
router.post('/add-admin-account', addAccount)
router.delete('/remove-admins/:id', deleteAdminAccount)



module.exports = router