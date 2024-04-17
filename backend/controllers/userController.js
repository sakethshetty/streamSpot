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
        throw new Error(error)
    }
};



exports.login =async (req, res,next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            res.status(401).json({ success: false, error: 'Invalid User' });
            return;
        }
        const match = await bcrypt.compare(password, user.password);
          if (!match) {
             res.status(401).json({ success: false, error: 'Invalid credentials' });
             return;
            }

        req.session.user = {
            id: user.id,
            email: user.email,
        };

        res.status(200).json({ success: true, user: req.session.user });
    } catch (error) {
        console.error('Error occurred during login:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
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