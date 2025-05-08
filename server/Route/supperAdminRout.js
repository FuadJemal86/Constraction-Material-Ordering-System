const express = require('express')
const { Login } = require('../controllers/supperAdmin/login')
const { addSupperAdminAccount } = require('../controllers/supperAdmin/add.supper.admin')
const { getAllAdmins } = require('../controllers/supperAdmin/getAdmis')

const router = express.Router()


router.post('/login', Login)
router.get('/get-admis', getAllAdmins)
router.post('/add-supper-admin', addSupperAdminAccount)



module.exports = router