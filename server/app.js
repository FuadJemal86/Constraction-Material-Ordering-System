const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const supperAdmin = require('./Route/supperAdminRout')
const adminRout = require('./Route/adminRout');
const customerRout = require('./Route/customerRout');
const supplierRout = require('./Route/supplierRout')



const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE'],
    credentials: true
}))

app.use(express.static('public'));
app.use('/supper-admin', supperAdmin)
app.use('/supplier', supplierRout);
app.use('/customer', customerRout);
app.use('/admin', adminRout)





app.listen(3032, () => {
    console.log('server is listn on port 3034')
})