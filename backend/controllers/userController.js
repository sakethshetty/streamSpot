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
        cookieToken(user, res);
        res.status(200).json({ message: 'User signed up successfully!' });
    } catch (error) {
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
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        throw error; 
    }
};




exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.status
    } catch (error) {
        throw new Error("Error in user Logged out");
    }
}