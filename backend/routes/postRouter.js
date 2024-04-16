const express = require('express')
const router = express.Router()
const { createPost, updatePost, deletePost, getAllPostsWithComments } = require('../controllers/postsController')

const isLoggedIn = require('../middleware/isLoggedIn')



//here first parameter isLoggedIN IS for verification ,
//where in middleware we used like this " async (req, res, next)" 
//means, we need to write the code whatever the logic but after writing "NEXT" is there so we are calling at end next() ==> check once isLogedIN.js


router.route('/post/createPost').post(isLoggedIn, createPost);
router.route('/post/updatePost/:id').put(isLoggedIn, updatePost);
router.route('/post/deletePost/:id').delete(isLoggedIn, deletePost);
router.route('/post/getAllPostsWithComments').get(getAllPostsWithComments);


module.exports=router