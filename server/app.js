const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { supplier } = require('./Route/supplier');
const { customer } = require('./Route/customer');




const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE'],
    credentials: true
}))

app.use(express.static('public'));
app.use('/supplier', supplier);
app.use('/customer', customer);






app.listen(3032, () => {
    console.log('server is listn on port 3034')
})