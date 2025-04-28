import express from 'express';
const app = express();
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from '../Models/user.mjs'

async function authenticateUser(req, res, next) {
    if (!req.cookies || !req.cookies.token) {
        res.send('You must be logged in to access this page');
        return res.redirect('/user-login');
    }

    const token = req.cookies.token;

    jwt.verify(token, 'key', async (err, decoded) => {
        if (err) {
            req.flash('error', 'Invalid or expired session');
            return res.redirect('/user-login');
        }

        // Fetch user from database
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/user-login');
        }

        req.user = user; // ✅ Pass full user details
        next();
    });
    
}
export const Home = (req, res) => {
    res.render("LandingPage");
};
export const usersignup = async (req, res) => {
    res.render('user-signup')
};
export const userdata =  async(req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        let createdUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate JWT token
        let token = jwt.sign({ email }, 'key');

        // Set token in HTTP-only cookie
        res.cookie('token', token, { httpOnly: true });

        res.status(201).redirect('/user-login');
    } catch (error) {
        console.error('Error in /profile:', error);
        res.status(500).send('Internal Server Error');
    }
};
export const userLogin = (req, res)=>{
    res.render('userlogin')
}


export const userProfile = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.redirect('/user-login'); // User not found, redirect
        }

        // ✅ Await bcrypt.compare instead of using a callback
        let isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.redirect('/user-login'); // Incorrect password, redirect
        }

        // ✅ Generate JWT token
        let token = jwt.sign({ email: user.email }, 'key', { expiresIn: '1h' });

        // ✅ Set cookie
        res.cookie('token', token, { httpOnly: true });

        // ✅ Redirect to dashboard (no additional response needed)
        return res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        
        // ✅ Ensure only one response is sent
        if (!res.headersSent) {
            return res.redirect('/user-login'); 
        }
    }
};
export const userLogout =  (req, res) =>{
    res.cookie('token',"")
    res.redirect('/user-signup')
}
export const userDashboard = (req, res) => {
    authenticateUser(req, res, () => {
        if (!req.user) {
            req.send('error', 'You must be logged in to access the dashboard');
            return res.redirect('/user-login');
        }

        res.render('dashboard', { user: req.user });
    });
};

export default app;