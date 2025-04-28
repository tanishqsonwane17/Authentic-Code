import dotenv from 'dotenv'
dotenv.config()
import dbConnection from './config/dbConnection.mjs'
dbConnection()
import express, { json, urlencoded } from 'express'
import User from './Routes/user.mjs'
import cors from 'cors'
const app = express()
app.set('view engine','ejs')
app.use(User)
app.use(express.json())
app.use(express.urlencoded({extended:true}))




app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

