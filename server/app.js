const express = require('express')
const cors = require('cors')
const {supplier} = require('./Route/supplier')




const app = express()



app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE'],
    credentials: true
}))


app.use(express.json())

app.use('/supplier' , supplier)






app.listen(3032 , ()=> {
    console.log('server is listn on port 3034')
})