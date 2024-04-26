// bring in prisma and cookies

const bcrypt = require('bcrypt');
const prisma = require('../prisma/index');
const cookieToken = require('../utils/cookieToken');

exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new Error('Please Provide all details');
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
            }
        });

        // Set the cookie token
        cookieToken(user, res);

        // Send a success response if everything went well
        //res.status(200).json({ message: 'User signed up successfully!' });
    } catch (error) {
        // Handle errors properly
        next(error);
    }
};



exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Please enter both credentials");
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        // If no user found
        if (!user) {
            throw new Error("User not found");
        }

        // If password mismatch
        if (user.password !== password) {
            throw new Error("Invalid password");
        }
        cookieToken(user, res);
        // If login successful, send success response
        //res.status(200).json({ message: "Login successful" });
    } catch (error) {
        // Pass the error to the error handling middleware
        // next(error);
        throw error; 
    }
};




exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.json({
            success:true
        })
    } catch (error) {
        throw new Error("Error in user Logged out");
    }
}