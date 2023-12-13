const express = require('express');
const app = express();
const connectDB = require('./config/db')
const cors = require('cors')
const userApiRoute = require('./routes/user');
const subscriberApiRoute = require('./routes/subscriber')

require('dotenv').config({path: './config/.env'})

connectDB()

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use(userApiRoute)
app.use(subscriberApiRoute)

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`i am now runing on port ${PORT}`);
})