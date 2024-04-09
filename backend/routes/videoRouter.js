const express = require('express');
const router = express.Router();
const { uploadVideo, deleteVideo, getAllvideos } = require('../controllers/videoController');
const isLogedIN = require('../middleware/isLoggedIn');

router.route('/post/uploadVideo').post(isLogedIN, uploadVideo);
router.route('/post/deleteVideo/:id').delete(isLogedIN, deleteVideo);
router.route('/post/getAllvideos').get(getAllvideos);

module.exports = router;