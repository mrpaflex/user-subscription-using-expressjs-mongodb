const express = require('express');
const app = express();
const connectDB = require('./config/db')
const cors = require('cors')
const userApiRoute = require('./routes/api/user');

require('dotenv').config({path: './config/.env'})

connectDB()

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use('/user/api', userApiRoute)

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`i am now runing on port ${PORT}`);
})