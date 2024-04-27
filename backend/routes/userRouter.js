const express = require('express')
const router = express.Router()

const isLoggedIn = require('../middleware/isLoggedIn')

const { signup,login, logout } = require('../controllers/userController');
router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
// router.route('/isloggedin').get(isLoggedIn, (req, res) => {return res.status(200).message({'login' : true});});
module.exports=router