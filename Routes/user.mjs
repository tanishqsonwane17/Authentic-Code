import express from 'express'
const router = express.Router()
import {Home, usersignup,userdata,userLogin, userProfile, userLogout,userDashboard} from '../controllers/userControllers.mjs'
import cors from 'cors'
router.use(express.json())
router.use(express.urlencoded({extended:true}))
router.use(cors({origin:"http://localhost:5173"}))
router.get('/',Home)
router.get('/user-signup',usersignup)
router.post('/user-data',userdata)
router.get('/user-Login',userLogin)
router.post('/user-profile',userProfile)
router.get('/Logout',userLogout)
router.get('/Dashboard',userDashboard)

export default router
